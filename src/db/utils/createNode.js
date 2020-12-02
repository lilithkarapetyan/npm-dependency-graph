const { instance: db } = require('../index');

const create = async (type, payload) => {

    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key])

    const result = await db.mergeOn(type, { name: payload.name }, payload);
    return result;
};

module.exports = create;
