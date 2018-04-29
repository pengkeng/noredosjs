const App = require('./src/app');

const path = process.argv[2] || '';
const app = App(
    path,
    [
        '.git',
        'node_modules',
    ],
);
app.run();
