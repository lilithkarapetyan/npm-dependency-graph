module.exports = {
    NPM_URL: 'https://registry.npmjs.cf/',
    GITHUB_NAME_REGEXP: /((?<=\.com\/)|(?<=\.com\:)).*$/g,
    GITHUB_PACKAGE_JSON: (package) => `https://raw.githubusercontent.com/${package}/master/package.json`,
};
