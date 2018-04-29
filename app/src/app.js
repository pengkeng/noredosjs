const fs = require('fs');
const path = require('path');
const klaw = require('klaw');
const through2 = require('through2');
const isSafe = require('safe-regex');

const { RegexExtractor } = require('./regexExtractor');

module.exports = (rootPath = './', exclude = []) => {
    function isSafeRegex(regex) {
        return isSafe(regex);
    }

    function run() {
        if (!rootPath || rootPath === '') {
            rootPath = './';
        }

        const filterExcludedFunc = item => {
            const itemPath = path.relative(rootPath, item);
            return exclude.find((excludedPath, idx) => {
                return itemPath.indexOf(excludedPath) !== -1;
            }) === undefined;
        };

        const regexExtractor = new RegexExtractor();
        klaw(rootPath)
            .pipe(through2.obj(function (item, enc, next) {
                if (filterExcludedFunc(item.path)) {
                    this.push(item);
                }

                next();
            }))
            .pipe(through2.obj(function (item, enc, next) {
                 if (path.extname(item.path) === '.js') {
                     this.push(item);
                 }

                next();
            }))
            .on('data', function (file) {
                fs.readFile(file.path, 'utf-8', (err, data) => {
                    regexExtractor.extract(data).forEach((result) => {
                        const shortPath = path.relative(__dirname, file.path);
                        console.log(`[${shortPath}:${result.startLine}:${result.startColumn}]`);
                        console.log(`/${result.regex.source}/ is`, isSafeRegex(result.regex) ? "SAFE" : "UNSAFE", '\n');
                    });
                });
            });
    }

    return {
        run,
    };
};
