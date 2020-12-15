const Neode = require('neode');
const { modelTypes } = require('./models');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

const neo4j = require('neo4j-driver')

const driver = neo4j.driver(NEO4J_URL, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD))
const session = driver.session()


module.exports = {
    modelTypes,
    instance: session,
};
