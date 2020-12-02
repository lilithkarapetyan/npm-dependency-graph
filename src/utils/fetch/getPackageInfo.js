const axios = require('axios');
const { NPM_URL } = require('../constants');

const getPackageInfo = async (name) => {
    return (await axios.get(`${NPM_URL}${name}`)).data;
};

module.exports = getPackageInfo;
