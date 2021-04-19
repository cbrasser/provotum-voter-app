import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import PropTypes from 'prop-types';
import config from './config/index';


export const connect = createAsyncThunk('elections/connect', async (vars, { getState, requestId }) => {
    const state = getState().substrate;
    const api = state.api;

    if (api) return;
    console.log('connecting to chain');
    console.log(api ? 'got api' : 'no api');
    console.log(types ? 'got types' : 'no types');
    console.log(socket ? 'got socket' : 'no socket');
    console.log(jsonrpc ? 'got rpc' : 'no rpc');

    //const _api = new ApiPromise({ provider, types, rpc: jsonrpc });
    console.log(_api.genesisHash.toHex());
    // We want to listen to event for disconnection and reconnection.
    //  That's why we set for listeners.
    /*_api.on('connected', () => {
        dispatch({ type: 'CONNECT', payload: _api });
        // `ready` event is not emitted upon reconnection. So we check explicitly here.
        _api.isReady.then((_api) => dispatch({ type: 'CONNECT_SUCCESS' }));
    });*/
    //_api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
    //_api.on('error', (err) => dispatch({ type: 'CONNECT_ERROR', payload: err }));
    return _api;
});

// Main slice
export const substrateSlice = createSlice({
    name: 'substrate',
    initialState: {
        status: 'offline',
        socket: config.PROVIDER_SOCKET,
        jsonrpc: { ...jsonrpc, ...config.RPC },
        types: config.CUSTOM_TYPES,
        keyring: null,
        keyringState: null,
        api: null,
        apiError: null,
        apiState: null,
    },
    reducers: {
    },
    // Automatically listen to changes in the async actions
    extraReducers: {
        [connect.pending]: (state, action) => {
            console.log('connecting');
            state.status = 'loading'
        },
        [connect.fulfilled]: (state, action) => {
            console.log('connected');
            state.status = 'succeeded';
            state.api = action.payload;
        },
        [connect.rejected]: (state, action) => {
            console.log('error connecting', action)
            state.status = 'error';
            state.error = action.error.message;
        },
    }
})


//export selectors

//export reducer
export default substrateSlice.reducer;