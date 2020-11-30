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
            required: false,
        },
        created_at: 'date',
        last_updated_at: 'date',
        lastest_version: {
            type: 'string',
            required: false,
        },
        _keywords: {
            type: 'string',
            required: false,
        }, // ;-separated, uppercase strings
    });
};

module.exports = init;
