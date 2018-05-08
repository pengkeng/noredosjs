const getopts = require('getopts');
const { FileWalker } = require('./fileWalker');
const { ResultFormatter } = require('./resultFormatter');

module.exports = () => {
    async function run(rootPath, exclude, verbose, silent) {
        const fileWalker = new FileWalker(rootPath, exclude);
        const results = await fileWalker.validate();

        if (!silent) {
            console.log((new ResultFormatter(results)).getReport(verbose));
        }

        return results;
    }

    return {
        run,
    };
};
