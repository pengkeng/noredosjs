const { FileWalker } = require('./fileWalker');

module.exports = (rootPath = './', exclude = []) => {
    function run() {
        const fileWalker = new FileWalker(rootPath, exclude);
        fileWalker.validate();
    }

    return {
        run,
    };
};
