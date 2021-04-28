import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STORE_STATI } from './../utils';
import { BigInteger } from 'jsbn';
import { idpAPIUrl } from './../utils';
import { blind, unblind, verify } from 'blind-signatures';
const axios = require("axios").default;
import { bnToHex } from '@polkadot/util';
import BN from 'bn.js';

export const createVoterWallet = (keyring, seed = '//Voter') => (dispatch) => {
    console.log('creating a wallet with seed: ', seed);
    const keyringPair = keyring.addFromUri(seed, { name: 'voter' }, 'sr25519');
    //const keyringPair = keyring.addUri(seed, '', { name: 'Voter' }, 'sr25519');
    dispatch({
        type: 'voter/VOTER_KEYRING_CREATED',
        payload: keyringPair,
    });
    return keyringPair;
};

export const blindAddress = (address, params) => async (dispatch) => {
    console.log('params: ', params);
    const modulus = new BigInteger(params.modulus.toString(16), 16);
    const exponent = new BigInteger(params.exponent.toString(16), 16);
    console.log('blinding');
    const { blinded, r } = blind({
        message: address,
        N: modulus,
        E: exponent,
    });
    console.log('blinded')
    dispatch({
        type: 'voter/BLIND_ADDRESS',
        payload: {
            address,
            blinded: blinded.toString(16),
            blindingFactor: r.toString(16),
            params,
        },
    });

    const signedResponse = await axios.post(
        '/signatures',
        { message: blinded.toString(16) },
        {
            baseURL: idpAPIUrl,
        },
    );

    const blindSignature = new BigInteger(signedResponse.data.signature, 16);

    const unblindSignature = unblind({
        signed: blindSignature,
        N: modulus,
        r: r,
    });

    const verifies = verify({
        unblinded: unblindSignature,
        N: modulus,
        E: exponent,
        message: address,
    });
    console.log('Signature verified!', verifies);

    const signature = bnToHex(new BN(unblindSignature.toString(16), 16));

    dispatch({
        type: 'voter/ADDRESS_SIGNED',
        payload: {
            address,
            unblindSignature: signature,
        },
    });

    return signature;
};

export const registerVoter = (api, signature, keyringPair) => async (dispatch) => {
    //TODO: add check if address is already registered!
    await api.isReady;
    const tx = api.tx.provotum.registerVoter(signature);
    try {
        console.log('sent registration transaction')
        let result = await tx.signAndSend(keyringPair);
        console.log(`Current status is ${result}`);
        dispatch({
            type: 'voter/ADDRESS_SUBMITTED_TO_CHAIN',
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }


};

export const voterSlice = createSlice({
    name: 'voter',
    initialState: {
        status: STORE_STATI.INITIAL,
        keyring: null,
        blind: {
            address: null,
            blinded: null,
            blindingFactor: null,
            params: null,
            signature: null,
            submitted: false,
        },
    },
    reducers: {
        VOTER_KEYRING_CREATED(state, action) {
            state.keyring = action.payload;
        },
        BLIND_ADDRESS(state, action) {
            state.blind = action.payload;
        },
        ADDRESS_SIGNED(state, action) {
            state.blind.signature = action.payload.unblindSignature;
        },
        ADDRESS_SUBMITTED_TO_CHAIN(state, action) {
            console.log('address got submitted to chain');
            state.blind.submitted = true;
        },
    },
    extraReducers: {}
})

export const selectKeyringPair = (state) => state?.voter?.keyring;
export const selectAddressSubmitted = (state) => state.voter.blind.submitted;
//export reducer
export default voterSlice.reducer;