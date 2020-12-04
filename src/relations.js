require('dotenv').config();

const getDependencies = require('get-dependencies');

const db = require('./db');
const { createRel, getById } = require('./db/utils');
const { init: initLogger, LogModel, ErrorModel } = require('./logger');
const { GITHUB_PACKAGE_JSON, GITHUB_NAME_REGEXP } = require('./utils/constants');

db.init();
initLogger();

(async () => {
    const [start, end, step] = process.argv.slice(2);
    const limit = +step;
    const maxCount = (+end) - (+start);

    let skip = +start;

    let successCount = 0;
    let failedCount = 0;
    let invalidCount = 0;

    let maxIterations = Math.floor(maxCount / limit);
    console.log(`Started at ${Date.now()}`);
    for(let i = 0; i < maxIterations; i++) {
        console.time(`Started Chunk: ${i * limit}-${(i + 1) * limit}`);
        try {
            skip += limit;
            const nodes = await getById({
                skip,
                limit,
            });

            const items = nodes && nodes.records.map(record => record &&
                record._fields &&
                record._fields.length &&
                record._fields[0].properties);

            if (!items) {
                invalidCount++;
                continue;
            }

            for (let package of items) {
                try {
                    if (!package || !package.repo) {
                        invalidCount++;
                        continue;
                    }
                    let name = (package.repo.match(GITHUB_NAME_REGEXP) || [])[0];
                    if (!name) continue;
                    const index = name.lastIndexOf('.');
                    name = name.substring(0, index);
                    const deps = await getDependencies.getByUrl(GITHUB_PACKAGE_JSON(name))
                    successCount++;
                    for (let dep of deps) {
                        try {
                            await createRel({
                                package1: package.name,
                                package2: dep,
                            });
                        } catch (e) {
                            ErrorModel.create({
                                type: 'rel',
                                processId: skip + maxCount,
                                package: dep,
                                message: e.message,
                                stack: e.stack,
                            });
                        }
                    }
                } catch (e) {
                    failedCount++;
                    ErrorModel.create({
                        type: 'rel',
                        processId: skip + maxCount,
                        package: package.name,
                        message: e.message,
                        stack: e.stack
                    });
                }
            }

        }
        catch (e) {
            failedCount += limit;
            ErrorModel.create({
                type: 'rel',
                processId: skip + maxCount,
                message: e.message,
                stack: e.stack
            });
        }

        console.timeEnd(`Started Chunk: ${i * limit}-${(i + 1) * limit}`);
        LogModel.create({
            successCount,
            failedCount,
            invalidCount,
            chunk: i * limit,
            memory: process.memoryUsage().heapUsed / 1024 / 1024,
            processId: skip + maxCount,
            type: 'rel'
        });
    }
    console.log(`Finished at ${Date.now()}`);
})();
