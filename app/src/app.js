const { FileWalker } = require('./fileWalker');

module.exports = () => {
    function run(rootPath = './', exclude = [], stdout = true) {
        const fileWalker = new FileWalker(rootPath, exclude);
        return fileWalker.validate(stdout);
    }

    return {
        run,
    };
};
