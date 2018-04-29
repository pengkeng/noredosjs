const klaw = require('klaw');
const esprima = require('esprima');

module.exports = (rootPath = './') => {
    function run() {
        if (!rootPath || rootPath === '') {
            rootPath = './';
        }

        klaw(rootPath)
            .on('data', (file) => {
                console.log(file);
            });
    }

    return {
        run,
    };
};
