const getopts = require('getopts');
const { FileWalker } = require('./fileWalker');

module.exports = () => {
    async function run(rootPath, exclude, stdout, verbose) {
        const fileWalker = new FileWalker(rootPath, exclude);
        const results = await fileWalker.validate(stdout, verbose);
        return results;
    }

    return {
        run,
    };
};
