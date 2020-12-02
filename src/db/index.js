const Neode = require('neode');
const { initPackageModel, modelTypes } = require('./models');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

const db = new Neode(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);

const init = () => {
    initPackageModel(db);
};

module.exports = {
    init,
    modelTypes,
    instance: db,
};
