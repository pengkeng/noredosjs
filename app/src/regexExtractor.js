const util = require('util');
const esprima = require('esprima');
const traverse = require('traverse');

const { RegexExtractorResult } = require('./RegexExtractorResult');

module.exports.RegexExtractor = class {
    isRegexParentNode(node) {
        return ['VariableDeclarator', 'ExpressionStatement'].includes(node.type);
    }

    addResultToList(list, result) {
        const hasRegex = list.findIndex((el, idx) => {
            return el.regex.source === result.regex.source;
        }) !== -1;

        if (!hasRegex) {
            list.push(result);
        }
    }

    extract(text) {
        const regexes = [];
        const ast = esprima.parseModule(text, { loc: true }, (node) => {
            if (this.isRegexParentNode(node)) {
                traverse(node).map((n) => {
                    if (!n || n.length === 0) {
                        return;
                    }

                    if ((n.type === 'Literal' && n.hasOwnProperty('regex') && n.regex.hasOwnProperty('pattern'))
                    ) {
                        const regex = new RegExp(n.regex.pattern);
                        const result = new RegexExtractorResult(regex, n.loc);
                        this.addResultToList(regexes, result);

                    } else if (n.hasOwnProperty('callee') && n.callee.name && n.callee.name.toLowerCase() === 'regexp') {
                        if (n.arguments && n.arguments.length > 0 && n.arguments[0].type === 'Literal') {
                            const regex = new RegExp(n.arguments[0].value);
                            const result = new RegexExtractorResult(regex, n.loc);
                            this.addResultToList(regexes, result);
                        }
                    }
                });
            }
        });

        return regexes;
    }
};
