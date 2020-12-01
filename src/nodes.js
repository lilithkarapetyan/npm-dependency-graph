require('dotenv').config();

const db = require('./db');
const minMax = require('./utils/minMax');
const types = require('./db/models/types');

const { createNode } = require('./db/utils');
const { getNames, getPackageInfo } = require('./utils/fetch');
const { init: initLogger, LogModel, ErrorModel } = require('./logger');

db.init();
initLogger();

(async () => {

    const [start, end, step] = process.argv.slice(2);
    const limit = +step;
    const maxCount = (+end) - (+start);

    let skip = +start;
    console.log(limit, maxCount, skip)

    let maxIterations = Math.floor(maxCount / limit) + 1;

    let successCount = 0;
    let failedCount = 0;

    console.log(`Started at ${Date.now()}`);
    while (--maxIterations) {
        try {
            const packagesData = await getNames({
                limit,
                skip,
            });
            const packagesNames = packagesData.rows.map(pckg => pckg.id);

            for (let packageName of packagesNames) {
                try {
                    const package = await getPackageInfo(packageName);
                    const {
                        name,
                        versions,
                        repository,
                        time: { created, modified, },
                        keywords
                    } = package;
                    const latest = minMax(Object.keys(versions))[1];
                    const joinedKeywords = keywords && keywords.length ? keywords.join(';').toUpperCase() : undefined;

                    if (!repository || !repository.url) continue;

                    await createNode(types.PACKAGE, {
                        name,
                        repo: repository && repository.url,
                        created_at: created,
                        last_updated_at: modified,
                        lastest_version: latest,
                        keywords: joinedKeywords,
                    });
                    successCount++;
                }
                catch (e) {
                    failedCount++;
                    ErrorModel.create({
                        type: 'node',
                        processId: skip + maxCount,
                        error: e,
                    });
                }
            }
            skip += limit;
        }
        catch (e) {
            failedCount += limit;
            ErrorModel.create({
                type: 'node',
                processId: skip + maxCount,
                error: e,
            });
        }

        LogModel.create({
            successCount,
            failedCount,
            memory: process.memoryUsage().heapUsed / 1024 / 1024,
            processId: skip + maxCount,
            type: 'node'
        });
    }

    console.log(`Finished at ${Date.now()}`);
})();
