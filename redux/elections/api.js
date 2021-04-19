const axios = require("axios").default;


export const getVotes = async (vaUrl) => {
    console.log("fetching votes");
    try {
        let response = await axios.get(`http://${vaUrl}/votes`);
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.log(e);
        return [];
    }
};

export const fetchResults = async (vaUrl, electionId) => {
    console.log(`fetching results vor vote ${electionId}`);
    try {
        let response = await axios.get(`http://${vaUrl}/votes/results`, {
            params: {
                voteId: electionId
            }
        });
        console.log(response.data);
        return response.data;

    } catch (e) {
        console.log(e);
    }
}