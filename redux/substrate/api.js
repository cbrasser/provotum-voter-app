import config from './config/index';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { ApiPromise, WsProvider } from '@polkadot/api';


let api = undefined;

const types = config.CUSTOM_TYPES;
const socket = config.PROVIDER_SOCKET;
const rpc = { ...jsonrpc, ...config.RPC };

async function getAPI() {
    if (api) return api;
    const provider = new WsProvider(socket);
    api = await ApiPromise.create({ provider: provider, types: types, rpc: rpc });
    return api;
}


export { getAPI };