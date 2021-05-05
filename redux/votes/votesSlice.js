import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { hexToBn } from '@polkadot/util';

export const subscribeToResults = (api, voteId) => async (dispatch) => {
    await api.isReady;

    await api.query.provotum.tallies(voteId, (response) => {
        let tallies = response.toHuman();
        tallies = tallies.map((result) => ({
            ...result,
            subjectId: result.subject_id,
        }));
        console.log('tallies', tallies);
        dispatch({
            type: 'votes/RESULTS_AVAILABLE',
            payload: {
                voteId,
                results: tallies,
            },
        });
    });
};

export const answerSubject = (voteId, subjectId, answer) => (dispatch) =>
    dispatch({
        type: 'ANSWER',
        payload: { voteId, subjectId, answer },
    });

export const selectVote = (voteId) => (dispatch) => dispatch({ type: VOTE_SELECTED, payload: voteId });

export const getElections = createAsyncThunk('votes/getElections', async (api, thunkAPI) => {
    thunkAPI.dispatch({ type: 'ELECTIONS_PENDING' });
    await api.isReady;

    await api.query.provotum.elections.entries(async (response) => {
        const elections = await Promise.all(
            response.map(async ([key, electionEncoded]) => {
                const election = electionEncoded.toHuman();
                const electionId = key.args.map((k) => k.toHuman())[0];
                const subjectsResponse = await api.query.provotum.subjects(electionId);
                const publicKeyResponse = await api.query.provotum.publicKey(electionId);

                await api.query.provotum.publicKey(electionId, (response) => {
                    const publicKey = hexToBn(response.toHuman());
                    const publicKeySet = !publicKey?.eqn(0);
                    if (publicKeySet) {
                        thunkAPI.dispatch({
                            type: 'PUBLIC_KEY_FETCHED',
                            payload: {
                                electionId: electionId,
                                publicKey: String(publicKey),
                            },
                        });
                    }
                });

                return {
                    electionId,
                    ...election,
                    params: {
                        p: hexToBn(election.params.p),
                        g: hexToBn(election.params.g),
                        q: hexToBn(election.params.p).subn(1).divn(2),
                    },
                    subjects: subjectsResponse.toHuman(),
                    publicKey: String(hexToBn(publicKeyResponse.toHuman())),
                };
            }),
        );
        //return elections;
        thunkAPI.dispatch({
            type: 'votes/ELECTIONS_SUCCESS',
            payload: elections,
        });

    });
});

export const votesSlice = createSlice({
    name: 'votes',
    initialState: {
        votes: [],
        selectedVote: null,
        pending: true,
    },
    reducers: {
        ELECTIONS_PENDING(state, action) {
            state.pending = true;
        },
        ELECTIONS_SUCCESS(state, action) {
            //console.log('ELECTION SUCCESS');
            //console.log(action.payload);
            state.votes = action.payload;
            state.pending = false;
        },
        PUBLIC_KEY_FETCHED(state, action) {
            const { electionId, publicKey } = action.payload;
            const votesUpdated = state.votes.map((election) => {
                if (election.electionId === electionId) {
                    return {
                        ...election,
                        publicKey,
                    };
                } else {
                    return election;
                }
            });
            state.votes = votesUpdated;
        },
        VOTE_SELECTED(state, action) {
            state.selectedVote = action.payload;
        },
        ANSWER(state, action) {
            const { voteId, subjectId, answer } = action.payload;

            const votes = Object.assign([], state.votes);
            const { subjects } = votes.find((vote) => vote.electionId === voteId);
            const subject = subjects.find(([subjId]) => subjId === subjectId);
            if (subject.length === 3) {
                subject[2] = answer;
            } else {
                subject.push(answer);
            }
            state.votes = votes;
        },
        RESULTS_AVAILABLE(state, action) {
            state.votes.find(v => v.electionId === action.payload.voteId).results = action.payload.results;
            //state.results = action.payload
        },
    },
    extraReducers: {
        /*[getElections.fulfilled]: (state, action) => {
            console.log('received elections: ', action.payload)
            state.pending = false;
            action.payload.forEach(election => {
                if (!state.elections.find(e => e.electionId === election.electionId) > 0) {
                    state.elections.push(election);
                }
            });
            //state.elections = state.elections.concat(action.payload);
        },*/
    }
})
export const resultSelect = (state) => {
    const votes = state.votes?.votes;
    const selectedVote = Object.assign({}, selectedVoteSelect(state));
    const tallies = state.votes?.results;

    if (selectedVote && votes?.length && tallies?.results?.length) {
        tallies.results = tallies.results.map(res => {
            const [, question] = selectedVote.subjects.find(([subjectId]) => subjectId === res.subjectId) ?? ['', ''];
            return {
                ...res,
                question: question,
            };
        });
    }
    return tallies;
};

export const selectSelectedVote = (state) =>
    state?.votes?.votes?.find((vote) => vote.electionId === state?.votes?.selectedVote);
/*export const selectElections = (state) => {
    return { pending: state.votes.pending, elections: state.votes.votes };
};*/
export const selectElections = state => state.votes.votes;

export const selectSelectedElection = (state) => state?.votes?.selectedVote;
export const selectElectionById = (state, id) => state.votes.votes.find(v => v.electionId === id);
export const selectElectionSubject = (state, voteId, subjectId) => state.votes.votes.find(v => v.electionId === voteId).subjects.find(s => s[0] === subjectId);
export const selectSubjectResults = (state, voteId, subjectId) => state.votes.votes.find(v => v.electionId === voteId).results.map(r => {
    return {
        ...r,
        yes: Number(r.yes.replaceAll(',', '')),
        no: Number(r.no.replaceAll(',', '')),
    }
}).find(r => r.subjectId === subjectId);
//export reducer
export default votesSlice.reducer;