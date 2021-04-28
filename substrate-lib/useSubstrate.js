import { useContext, useEffect, useCallback } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import Keyring from '@polkadot/keyring';
import { mnemonicGenerate } from '@polkadot/util-crypto';

import config from './config';
import { SubstrateContext } from './SubstrateContext';

const useSubstrate = () => {
    const [state, dispatch] = useContext(SubstrateContext);

    // `useCallback` so that returning memoized function and not created
    //   everytime, and thus re-render.
    const { api, socket, jsonrpc, types } = state;
    const connect = useCallback(async () => {
        if (api) return;

        const provider = new WsProvider(socket);
        const _api = new ApiPromise({ provider, types, rpc: jsonrpc });

        _api.on('connected', () => {
            dispatch({ type: 'CONNECT', payload: _api });
            // `ready` event is not emitted upon reconnection. So we check explicitly here.
            _api.isReady.then((_api) => dispatch({ type: 'CONNECT_SUCCESS' }));
        });
        _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
        _api.on('error', (err) => dispatch({ type: 'CONNECT_ERROR', payload: err }));
    }, [api, socket, jsonrpc, types, dispatch]);

    const { keyringState } = state;
    const loadAccounts = useCallback(async () => {
        // Ensure the method only run once.
        console.log('loading keyring');
        if (keyringState) return;
        console.log('trying to get keyring');
        try {

            const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

            const mnemonic = mnemonicGenerate();
            console.log('test');
            const pair = keyring.addFromUri(mnemonic, { name: 'first pair' }, 'ed25519');
            console.log(keyring.pairs.length, 'pairs available');
            console.log(pair.meta.name, 'has address', pair.address);
            dispatch({ type: 'SET_KEYRING', payload: keyring });
        } catch (e) {
            console.log('could not get keyring');
            console.error(e);
            // dispatch({ type: 'KEYRING_ERROR' });
        }
    }, [keyringState, dispatch]);

    useEffect(() => {
        connect();
    }, [connect]);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    return { ...state, dispatch };
};

export default useSubstrate;
