require('dotenv').config();
const getDependencies = require('get-dependencies');

const db = require('./db');
const { createRel, getById } = require('./db/utils');
const { GITHUB_PACKAGE_JSON, GITHUB_NAME_REGEXP } = require('./utils/constants');

db.init();

(async () => {
    const [start, end, step] = process.argv.slice(2);
    const limit = +step;
    const maxCount = (+end) - (+start);

    let skip = +start;
    
    let maxIterations = Math.floor(maxCount / limit) + 1;
    console.log(`Started at ${Date.now()}`);
    while (--maxIterations) {
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
            
            if(!items) continue;

            for(let package of items){
                if(!package || !package.repo) continue;
                let name = (package.repo.match(GITHUB_NAME_REGEXP) || [])[0];
                if(!name) continue;
                const index = name.lastIndexOf('.');
                name = name.substring(0, index);
                const deps = await getDependencies.getByUrl(GITHUB_PACKAGE_JSON(name))
                for(let dep of deps){
                    await createRel({
                        package1: package.name,
                        package2: dep,
                    });
                }
            }
            
        }
        catch (e) {
            console.log(e);
        }
    }
    console.log(`Finished at ${Date.now()}`);
})();
