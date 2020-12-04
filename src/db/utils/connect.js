const { instance: db } = require('../index');
const types = require('../models/types');

const connect = async (firstNode, secondNode, relation) => {
    const result = await db.cypher(`MATCH (a:${types.PACKAGE} { name: $firstName }),
    (b:${types.PACKAGE} { name: $secondName })
    CREATE (a)-[r:${types.DEPENDENT_ON}]->(b)`, {
        firstName: firstNode.name,
        secondName: secondNode.name,
    });
    return result;
};

module.exports = connect;
