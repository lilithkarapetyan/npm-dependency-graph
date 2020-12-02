const axios = require('axios');
const { NPM_ALL_URL } = require('../constants');

const getNames = async (payload) => {
    const { skip, limit = 100, startKey } = payload;

    return (await axios.get(NPM_ALL_URL, {
        params: {
            skip,
            limit,
            startKey,
        },
    })).data || {};
};

module.exports = getNames;
