import { configureStore } from '@reduxjs/toolkit';
import electionReducer from './redux/elections/electionSlice';
import substrateReducer from './redux/substrate/substrateSlice';
export default configureStore({
    reducer: {
        elections: electionReducer,
        substrate: substrateReducer,
    }
})