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

    let maxIterations = Math.floor(maxCount / limit);

    let successCount = 0;
    let failedCount = 0;
    let invalidCount = 0;

    console.log(`Started at ${Date.now()}`);
    for(let i = 0; i < maxIterations; i++){
        console.time(`Started Chunk: ${i*limit}-${(i+1)*limit}`);
        try {
            const packagesData = await getNames({
                limit,
                skip,
            });
            const packagesNames = packagesData.rows.map(pckg => pckg.id);
            console.log(`Got ${packagesNames.length} packages`);

            for (let packageName of packagesNames) {
                try {
                    const package = await getPackageInfo(packageName);
                    if(!package){
                        invalidCount++;
                        continue;
                    }
                    const {
                        name,
                        versions,
                        repository,
                        keywords
                    } = package;
                    const created = package.time && package.time.created || undefined;
                    const modified = package.time && package.time.modified || undefined;

                    const latest = minMax(Object.keys(versions || {}))[1] || undefined;
                    const joinedKeywords = keywords && keywords.length ? keywords.join(';').toUpperCase() : undefined;

                    if (!repository || !repository.url){
                        invalidCount++;
                        continue;
                    }
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
                        package: packageName,
                        processId: skip + maxCount,
                        message: e.message,
                        stack: e.stack,
                    });
                }
            }
            skip += limit;
        }
        catch (e) {
            failedCount += limit;
            ErrorModel.create({
                type: 'node',
                chunk: i*limit,
                processId: skip + maxCount,
                message: e.message,
                stack: e.stack,
            });
        }
        
        console.timeEnd(`Started Chunk: ${i*limit}-${(i+1)*limit}`);
        LogModel.create({
            successCount,
            failedCount,
            invalidCount,
            chunk: i*limit,
            memory: process.memoryUsage().heapUsed / 1024 / 1024,
            processId: skip + maxCount,
            type: 'node'
        });
    }

    console.log(`Finished at ${Date.now()}`);
    process.exit(0);
})();
