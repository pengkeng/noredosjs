const util = require('util');
const esprima = require('esprima');
const traverse = require('traverse');

module.exports.RegexExtractor = class {
    constructor() {
        const regex = new RegExp('hello');
        const regex2 = /hello2/;
        "dorop".match(/dordfijdjfhj/);
    }

    isRegexParentNode(node) {
        return ['VariableDeclarator', 'ExpressionStatement'].includes(node.type);
    }

    extract(text) {
        //console.log(util.inspect(esprima.parseModule(text), { depth: null, showHidden: false }));
        const regexes = [];
        const ast = esprima.parseModule(text, {}, (node) => {
            if (this.isRegexParentNode(node)) {
                traverse(node).map((n) => {
                    if (!n || n.length === 0) {
                        return;
                    }

                    if ((n.type === 'Literal' && n.hasOwnProperty('regex'))
                        || (n.hasOwnProperty('callee') && n.callee.name && n.callee.name.toLowerCase() === 'regexp')
                    ) {
                        regexes.push(n);
                    }
                });
            }
        });

        return regexes;
    }
};
