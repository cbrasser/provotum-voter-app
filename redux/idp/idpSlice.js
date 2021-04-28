import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { idpAPIUrl } from './../utils';
import { hexToBn } from '@polkadot/util';

const axios = require("axios").default;

export const setIdPParams = (params) => (dispatch) =>
    dispatch({
        type: IDP_PARAMS,
        payload: params,
    });

export const getIdentityProviderPublicKey = createAsyncThunk('idp/getIdentityProviderPublicKey', async () => {
    console.log('sending request to: ', idpAPIUrl);
    try {
        const response = await axios.get('/signatures', {
            baseURL: idpAPIUrl,
        });
        console.log('response: ', response.data);
        const params = response.data;
        const idpParams = {
            exponent: hexToBn(params.exponent),
            modulus: hexToBn(params.modulus),
            alg: params.alg,
        };
        console.log('IDP Params', idpParams);
        return idpParams;
    } catch (e) {
        console.log(e);
    }

});

export const idpSlice = createSlice({
    name: 'idp',
    initialState: {
        exponent: null,
        modulus: null,
        alg: null,
    },
    reducers: {
        IDP_PARAMS(state, action) {
            const { exponent, modulus, alg } = action.payload;
            state.exponent = exponent;
            state.modulus = modulus;
            state.alg = alg;
        },
    },
    extraReducers: {
        [getIdentityProviderPublicKey.fulfilled]: (state, action) => {
            state.exponent = action.payload.exponent;
            state.modulus = action.payload.modulus;
            state.alg = action.payload.alg;
        }
    }
})

export const selectIdpParams = (state) => state?.idp;

//export reducer
export default idpSlice.reducer;