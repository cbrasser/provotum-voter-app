const axios = require("axios").default;
import { bnToHex, hexToBn, u8aToHex } from '@polkadot/util';


export const getVotes = async (api) => {
    await api.isReady;
    console.log('loading elections')
    const electionsResponse = await api.query.provotum.elections.entries();
    console.log('arst')
    const elections = await Promise.all(
        electionsResponse.map(async ([key, electionEncoded]) => {
            const election = electionEncoded.toHuman();
            const electionId = key.args.map((k) => k.toHuman())[0];
            const response = await api.query.provotum.subjects(electionId);

            return {
                electionId,
                ...election,
                subjects: response.toHuman(),
            };
        }),
    );
    return elections;
};

export const fetchResults = async (vaUrl, electionId) => {

}