import { configureStore } from '@reduxjs/toolkit';
import electionReducer from './redux/elections/electionSlice';

export default configureStore({
    reducer: {
        elections: electionReducer,
    }
})