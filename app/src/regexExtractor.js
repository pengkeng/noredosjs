const esprima = require('esprima');
const traverse = require('traverse');

const { RegexExtractorResult } = require('./regexExtractorResult');

module.exports.RegexExtractor = class {
    constructor(logger) {
        this._logger = logger;
    }

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

    extract(path, text) {
        const regexes = [];
        let ast = null;

        try {
            ast = esprima.parseModule(text, { loc: true }, (node) => {
                if (this.isRegexParentNode(node)) {
                    traverse(node).map((n) => {
                        if (!n || n.length === 0) {
                            return;
                        }

                        if ((n.type === 'Literal' && n.hasOwnProperty('regex') && n.regex.hasOwnProperty('pattern'))
                        ) {
                            const regex = new RegExp(n.regex.pattern);
                            const result = new RegexExtractorResult(regex, n.loc, path);
                            this.addResultToList(regexes, result);

                        } else if (n.hasOwnProperty('callee') && n.callee.name && n.callee.name.toLowerCase() === 'regexp') {
                            if (n.arguments && n.arguments.length > 0 && n.arguments[0].type === 'Literal') {
                                const regex = new RegExp(n.arguments[0].value);
                                const result = new RegexExtractorResult(regex, n.loc, path);
                                this.addResultToList(regexes, result);
                            }
                        }
                    });
                }
            });
        } catch (e) {
            this._logger.warn(`Failed to parse file: ${e.toString()}`);
        }

        return regexes;
    }
};
