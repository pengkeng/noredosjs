const { FileWalker } = require('./fileWalker');
const { ResultFormatter } = require('./resultFormatter');

const DEFAULT_BACKEND = 'default';
const RXXR_BACKEND = 'rxxr';

module.exports = (logger, consolePrinter) => {
    async function run(
        rootPath,
        exclude,
        verbose,
        silent,
        debug,
        backend,
    ) {
        consolePrinter.print("STARTING SCAN...");
        const fileWalker = new FileWalker(logger, rootPath, exclude);

        let results = null;
        if (backend === RXXR_BACKEND) {
            results = await fileWalker.validateWithRxxr();
            consolePrinter.print(results);
        } else {
            results = await fileWalker.validateWithDefault();
            consolePrinter.print((new ResultFormatter(results)).getReport(verbose));
        }

        return results;
    }

    return {
        run,
    };
};
