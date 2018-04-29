const esprima = require('esprima');

module.exports.RegexExtractor = class {
    constructor() {
        const regex = new RegExp('hello');
        const regex2 = /hello2/;
    }

    extract(text) {
        const regexes = [];
        const ast = esprima.parseModule(text, {}, (node) => {
            console.log(node);
        });

        return regexes;
    }
};
