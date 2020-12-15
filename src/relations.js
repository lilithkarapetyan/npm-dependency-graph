require('dotenv').config();

const getDependencies = require('get-dependencies');

const db = require('./db');
const { createRels, getById } = require('./db/utils');
const { init: initLogger, LogModel, ErrorModel } = require('./logger');
const { GITHUB_PACKAGE_JSON, GITHUB_NAME_REGEXP } = require('./utils/constants');

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
    for (let i = 0; i < maxIterations; i++) {
        console.time(`Started Chunk: ${i * limit}-${(i + 1) * limit}`);
        try {
            skip += limit;
            const items = await getById({
                skip,
                limit,
            });
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
                    console.log(name)
                    const githubName = GITHUB_PACKAGE_JSON(name).split('//')[1];
                    const deps = await getDependencies.getByUrl(githubName)
                    successCount++;

                    try {
                        console.time(`inserting ${deps} to ${package.name}`);
                        await createRels({
                            package: package.name,
                            packageDeps: deps,
                        });
                        console.timeEnd(`inserting ${deps} to ${package.name}`);

                    } catch (e) {
                        console.log(60, e)
                        break
                        ErrorModel.create({
                            type: 'rel',
                            processId: skip + maxCount,
                            package: dep,
                            message: e.message,
                            stack: e.stack,
                        });
                    }
                } catch (e) {
                    console.log(71, e)
                    break
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
            console.log(86, e)
            break
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
    process.exit(0);
})();
