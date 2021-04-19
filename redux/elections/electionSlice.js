import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getVotes, fetchResults } from './api';
// Async Actions (thunks)

export const getElections = createAsyncThunk('elections/getElections', async (vaUrl) => {
    let result = await getVotes(vaUrl);
    for await (const vote of result) {
        let results = await fetchResults(vaUrl, vote.electionId);
        vote.results = results;
    }

    return result;
});


// Main slice
export const electionsSlice = createSlice({
    name: 'elections',
    initialState: {
        elections: [],
        status: 'ready',
        error: '',
    },
    reducers: {
    },
    // Automatically listen to changes in the async actions
    extraReducers: {
        [getElections.pending]: (state, action) => {
            state.status = 'loading'
        },
        [getElections.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.elections = state.elections.concat(action.payload);
        },
        [getElections.rejected]: (state, action) => {
            state.status = 'error';
            state.error = action.error.message;
        },
    }
})


//export selectors
export const selectElections = state => state.elections.elections;
export const selectVotingElections = state => state.elections.elections.filter(e => e.phase === 'Voting');
export const selectElectionById = (state, electionId) => state.elections.elections.find((election) => election.electionId === electionId);

//export reducer
export default electionsSlice.reducer;