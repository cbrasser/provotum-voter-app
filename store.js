import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import voteReducer from './redux/votes/votesSlice';
import voterReducer from './redux/voter/voterSlice';
import idpReducer from './redux/idp/idpSlice';
import ballotsReducer from './redux/ballots/ballotsSlice';
export default configureStore({
    reducer: {
        votes: voteReducer,
        voter: voterReducer,
        idp: idpReducer,
        ballots: ballotsReducer,
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false,
    }),
})