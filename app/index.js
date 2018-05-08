const getopts = require('getopts');

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
        verbose: true,
        stdout: true,
    },
});

App().run(
    options._[0] || './',
    [options.exclude],
    options.stdout,
    options.verbose,
);
