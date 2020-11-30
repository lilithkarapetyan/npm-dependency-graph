module.exports = {
    NPM_URL: 'https://registry.npmjs.cf/',
    NPM_ALL_URL: 'https://replicate.npmjs.com/_all_docs',
    GITHUB_NAME_REGEXP: /((?<=\.com\/)|(?<=\.com\:)).*$/g,
    GITHUB_PACKAGE_JSON: (package) => `https://raw.githubusercontent.com/${package}/master/package.json`,
};
