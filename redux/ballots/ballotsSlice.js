import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STORE_STATI } from './../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { bnToHex, hexToBn, u8aToHex } from '@polkadot/util';
import {
    computeCommitments,
    computeResponse,
    createRandomKeyPair,
    encrypt,
    generateBallotProof,
    randomValueInRange,
    verify as verifyBallot,
    verifyReEncryptionProof,
} from '@hoal/evote-crypto-ts';
const axios = require("axios").default;




export const castBallot = (vote, keyring, api) => async (dispatch) => {
    dispatch({
        type: 'ballots/PREPARING_BALLOTS',
    });
    console.log('vote: ', keyring)
    const { subjects, params, publicKey: publicKeyH } = vote;

    const publicKey = {
        h: publicKeyH,
        parameters: params,
    };

    console.log('preparing ballots, params: ', params);
    const [, voterPublicKey] = createRandomKeyPair(params);
    console.log('got random key pair');
    const uniqueId = hexToBn(u8aToHex(keyring.addressRaw));
    console.log('encrypting ballots');
    const encryptedBallots = await Promise.all(
        subjects
            .filter(([, , answer]) => !!answer)
            .map(async ([subjectId, , answer]) => {
                let answerBin = answer === 'yes' ? 1 : 0;

                const nonce = randomValueInRange(params.q);

                const encryptedBallot = encrypt(answerBin, publicKey, nonce);
                const proof = generateBallotProof(encryptedBallot, publicKey, nonce, uniqueId, answer, false);

                let verifies = verifyBallot(proof, encryptedBallot, publicKey, uniqueId, false);
                console.assert(verifies, 'Proof does not verify!');

                // dispatch({
                //     type: ENCRYPTED_BALLOT,
                //     payload: {
                //         subjectId, answer, encryptedBallot, proof,
                //     },
                // });

                // Initiate interactive protocol
                const w = randomValueInRange(params.q);
                const cLambda = randomValueInRange(params.q);
                const sLambda = randomValueInRange(params.q);
                const voterCommitments = computeCommitments(encryptedBallot, publicKey, answerBin, w, cLambda, sLambda);

                const challengeResponse = await axios.post(
                    '/random/challenges',
                    {
                        ballot: encryptedBallot,
                        uniqueId,
                        subjectId: hexToBn(subjectId),
                        strongProof: proof,
                        publicKey: publicKey,
                        voterCommitments,
                    },
                    {
                        baseURL: config.randomizerAPIUrl,
                    },
                );

                let { challenge, blindCommitments } = challengeResponse.data;
                challenge = new BN(challenge, 16);
                objWithHexStrToBn(blindCommitments);

                const blindResponse = computeResponse(challenge, cLambda, sLambda, nonce, w, answerBin, params);

                const proofResponse = await axios.post(
                    '/random/finalize',
                    {
                        response: blindResponse,
                        voterPublicKeyH: voterPublicKey.h,
                        uniqueId,
                        subjectId: hexToBn(subjectId),
                    },
                    {
                        baseURL: config.randomizerAPIUrl,
                    },
                );

                const { reEncryptedBallot, ballotProof, reEncryptionProof } = proofResponse.data;
                objWithHexStrToBn(reEncryptedBallot);
                objWithHexStrToBn(ballotProof);
                objWithHexStrToBn(reEncryptionProof);

                verifies = verifyReEncryptionProof(
                    reEncryptionProof,
                    reEncryptedBallot,
                    encryptedBallot,
                    publicKey,
                    voterPublicKey.h,
                );
                console.assert(verifies, 'Received ballot does not represent a re-encryption of the original ballot!');

                verifies = verifyBallot(ballotProof, reEncryptedBallot, publicKey, uniqueId, true);
                console.assert(verifies, 'Diverted proof does not verify!');

                console.log('Randomized ballot');
                // dispatch({
                //     type: RANDOMIZED_BALLOT,
                //     payload: {
                //         subjectId, reEncryptedBallot, ballotProof, reEncryptionProof,
                //     },
                // });

                const cipherToSubstrate = {
                    c: bnToHex(reEncryptedBallot.c),
                    d: bnToHex(reEncryptedBallot.d),
                };
                const proofToSubmit = {};
                Object.entries(ballotProof).forEach(([key, value]) => (proofToSubmit[key] = bnToHex(value)));

                return [subjectId, cipherToSubstrate, proofToSubmit];
            }),
    );

    const ballot = {
        answers: encryptedBallots,
    };
    console.log('encrypted ballots');
    dispatch({
        type: 'ballots/ENCRYPTED_BALLOTS',
        payload: ballot,
    });

    await api.isReady;
    try {
        const tx = api.tx.provotum.castBallot(vote.electionId, ballot);
        console.log(`Sending tx, keyring: `, keyring);
        tx.signAndSend(keyring, async ({ status }) => {
            console.log(`Current status is ${status}`);

            if (status.isInBlock) {
                const blockHash = status.asInBlock;
                console.log(status);
                console.log('transaction blockhash: ', blockHash);
                await dispatch({
                    type: 'ballots/BALLOTS_CAST',
                    payload: blockHash
                });
                const signedBlock = await api.rpc.chain.getBlock(blockHash);
                await dispatch({
                    type: 'voter/CAST_BALLOTS',
                    payload: [{
                        'blockHash': blockHash,
                        'block': signedBlock,
                        'voteId': vote.electionId,
                        'address': keyring.address,
                    }],
                })

            }
        }).catch((err) => {
            console.error('Failed to submit extrinsic. Waiting 2s and re-attempting', err);

            setTimeout(() => {
                tx.signAndSend(keyring, async ({ status }) => {
                    console.log(`Current status is ${status}`);
                    if (status.isInBlock) {
                        const blockHash = status.asInBlock;
                        await dispatch({
                            type: 'ballots/BALLOTS_CAST',
                            payload: blockHash
                        });
                        await dispatch({
                            type: 'voter/CAST_BALLOTS',
                            payload: [{
                                'blockHash': blockHash,
                                'voteId': vote.electionId,
                                'address': keyring.address,
                            }],
                        })
                    }
                });
            }, 2000);
        });
    } catch (e) {
        console.error('Failed to submit extrinsic', e);
    }
};


export const ballotsSlice = createSlice({
    name: 'ballots',
    initialState: {
        status: STORE_STATI.INITIAL,
        ballots: [],
        submitted: false,
    },
    reducers: {
        RESET_BALLOTS(state, action) {
            state.status = STORE_STATI.INITIAL;
            state.submitted = false;
            ballots = [];
        },
        PREPARING_BALLOTS(state, action) {
            state.status = STORE_STATI.PENDING;
        },
        ENCRYPTED_BALLOT(state, action) { },
        RANDOMIZED_BALLOT(state, action) { },
        ENCRYPTED_BALLOTS(state, action) {
            state.submitted = false;
            state.ballots = action.payload;
        },
        BALLOTS_CAST(state, action) {
            state.submitted = true;
            state.blockHash = action.payload.blockHash;
            state.status = STORE_STATI.SUCCESS;
        },
    },
    extraReducers: {}
})

export const exampleAuthSelect = (state) => state.exampleAuth;




export const selectBallotsState = (state) => state.ballots.status;
export const selectBlockHash = (state) => state?.ballots?.blockHash ?? '';
export const selectBallotSubmitted = (state) => state.ballots.submitted;


//export reducer
export default ballotsSlice.reducer;


