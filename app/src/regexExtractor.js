const util = require('util');
const esprima = require('esprima');
const traverse = require('traverse');

module.exports.RegexExtractor = class {
    isRegexParentNode(node) {
        return ['VariableDeclarator', 'ExpressionStatement'].includes(node.type);
    }

    addRegexToList(list, regex) {
        const hasRegex = list.findIndex((el, idx) => {
            return el.source === regex.source;
        }) !== -1;

        if (!hasRegex) {
            list.push(regex);
        }
    }

    extract(text) {
        //console.log(util.inspect(esprima.parseModule(text), { depth: null, showHidden: false }));
        const regexes = [];
        const ast = esprima.parseModule(text, { loc: true }, (node) => {
            if (this.isRegexParentNode(node)) {
                traverse(node).map((n) => {
                    if (!n || n.length === 0) {
                        return;
                    }

                    if ((n.type === 'Literal' && n.hasOwnProperty('regex') && n.regex.hasOwnProperty('pattern'))
                    ) {
                        this.addRegexToList(regexes, new RegExp(n.regex.pattern));

                    } else if (n.hasOwnProperty('callee') && n.callee.name && n.callee.name.toLowerCase() === 'regexp') {
                        if (n.arguments && n.arguments.length > 0 && n.arguments[0].type === 'Literal') {
                            this.addRegexToList(regexes, new RegExp(n.arguments[0].value));
                        }
                    }
                });
            }
        });

        return regexes;
    }
};
