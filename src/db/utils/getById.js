const types = require('../models/types');
const { instance: db } = require('../index');

const getById = async (payload) => {
    const result = await db.cypher(`MATCH (p:${types.PACKAGE}) WHERE id(p) >= $start AND id(p) < $end RETURN p`,
        {
            start: payload.skip,
            end: payload.skip + payload.limit
        });
    return result;
};

module.exports = getById;
