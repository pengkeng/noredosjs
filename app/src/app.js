const { FileWalker } = require('./fileWalker');
const { ResultFormatter } = require('./resultFormatter');

module.exports = (logger, consolePrinter) => {
    async function run(
        rootPath,
        exclude,
        verbose,
        silent,
    ) {
        consolePrinter.print("STARTING SCAN...");
        const fileWalker = new FileWalker(logger, rootPath, exclude);
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
