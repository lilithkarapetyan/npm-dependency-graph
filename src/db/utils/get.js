const { instance: db } = require('../index');

const getByName = async (type, name) => {
    const result = await db.cypher(`MATCH (p:$type {name: $name}) RETURN p`,
        {
            type,
            name
        });
    return result;
};

module.exports = getByName;
