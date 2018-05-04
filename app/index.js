const App = require('./src/app');

const path = process.argv[2] || '';
App().run(
    path,
    [
        '.git',
        'node_modules',
    ],
);
