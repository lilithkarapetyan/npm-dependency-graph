const { instance: db } = require('../index');
const types = require('../models/types');

const create = async (payload) => {
    const q = `
    MATCH (p1:${types.PACKAGE} {name: "${payload.package}"})
    WITH p1
    UNWIND [${payload.packageDeps.map(dep => `"${dep}"`)}] as batch
    MATCH (p:${types.PACKAGE} {name: batch})
    CREATE (p1)-[r:${types.DEPENDENT_ON}]->(p)
    RETURN r`;
    console.log(q)
    const result = await db.run(q,
    {
        node1: payload.package,
        batches: payload.packageDeps,
    });

    return result;
};

module.exports = create;