const { instance: db } = require('../index');

const connect = async (firstNode, secondNode, relation) => {
    const result = await db.cypher(`MATCH (a:$firstType { name: $firstName }),
    (b:$secondType { name: $secondName })
    CREATE (a)-[r:$relation]->(b)
    RETURN r`, {
        firstType: firstNode.type,
        secondType: secondNode.type,
        firstName: firstNode.name,
        firstName: secondNode.name,
        relation,
    });
    return result;
};

module.exports = connect;
