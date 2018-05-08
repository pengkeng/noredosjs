const getopts = require('getopts');
const winston = require('winston');

const ConsolePrinter = require('./src/consolePrinter');
const App = require('./src/app');

const options = getopts(process.argv.slice(2), {
    alias: {
        v: 'verbose',
    },
    default: {
        exclude: [
            '.git',
            'node_modules',
        ],
        verbose: false,
        silent: false, // Do not print output to stdout
        debug: false, // Print error messages and other logging information to the console
    },
});

const consolePrinter = ConsolePrinter(!options.silent);
const logger = new (winston.Logger)();

if (options.debug) {
    logger.add(winston.transports.Console);
}

App(logger, consolePrinter).run(
    options._[0] || './',
    [options.exclude],
    options.verbose,
    options.silent,
    options.debug,
);
