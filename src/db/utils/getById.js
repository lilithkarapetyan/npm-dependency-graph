const types = require('../models/types');
const { instance: db } = require('../index');

const getById = async (payload) => {
    const result = await db.run(
        `MATCH (p:${types.PACKAGE}) WHERE id(p) >= $start AND id(p) < $end RETURN p`,
        {
            start: payload.skip,
            end: payload.skip + payload.limit
        });
    
      const nodes = result && result.records && result.records.map(rec => {
          const single = rec.get(0);
          return single && single.properties;
        }) || [];
    
    return nodes;
};

module.exports = getById;
