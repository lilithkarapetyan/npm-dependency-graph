const modelTypes = require('./types');

const init = (db) => {
    db.model(modelTypes.PACKAGE, {
        name: {
            primary: true,
            type: 'string',
            index: true,
        },
        repo: 'string',
        created_at: 'date',
        last_updated_at: 'date',
        lastest_version: 'string',
        keywords: 'string', // ;-separated, uppercase strings
    });
};

module.exports = init;
