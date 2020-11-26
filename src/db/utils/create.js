const { instance: db } = require('../index');

const create = async (type, payload) => {
    const result = await db.merge(type, payload);
    return result;
};

module.exports = create;
