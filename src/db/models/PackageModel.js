const modelTypes = require('./types');

const init = (db) => {
    db.model(modelTypes.PACKAGE, {
        name: {
            primary: true,
            type: 'string',
            index: true,
        },
        repo: {
            type: 'string',
        },
        created_at: {
            type: 'date',
        },
        last_updated_at: {
            type: 'date',
        },
        lastest_version: {
            type: 'string',
        },
    });
};

module.exports = init;
