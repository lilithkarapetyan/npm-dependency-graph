const { instance: db } = require('../index');
const types = require('../models/types');

const create = async (payload) => {
    const result = await db.writeCypher(`MERGE (n1:${types.PACKAGE} { name: $node1 })
    MERGE (n2:${types.PACKAGE} { name: $node2 })
    MERGE (n1)-[r:${types.DEPENDENT_ON}]->(n2)
    RETURN n1, n2, r`, {
        node1: payload.package1,
        node2: payload.package2,
    });
    return result;
};

module.exports = create;