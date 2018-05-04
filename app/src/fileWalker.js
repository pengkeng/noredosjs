const fs = require('fs');
const path = require('path');
const klaw = require('klaw');
const through2 = require('through2');

const { RegexExtractor } = require('./regexExtractor');
const RegexValidator = require('./regexValidator')();

module.exports.FileWalker = class {
    constructor(rootPath, exclude) {
        this.rootPath = rootPath;
        this.exclude = exclude;
    }

    filterExcludedFiles(file) {
        const filePath = path.relative(this.rootPath, file);
        return this.exclude.find((excludedPath, idx) => {
            return filePath.indexOf(excludedPath) !== -1;
        }) === undefined;
    }

    validate(stdout = true) {
        this.walk((filePath, result) => {
            if (stdout) {
                const shortPath = path.relative(__dirname, filePath);
                console.log(`[${shortPath}:${result.regex.startLine}:${result.regex.startColumn}]`);
                console.log(`/${result.regex.regex.source}/ is`, result.safe ? "SAFE" : "UNSAFE", '\n');
            } else {
                return result;
            }
        });
    }

    walk(cb) {
        if (!this.rootPath || this.rootPath === '') {
            this.rootPath = './';
        }

        const regexExtractor = new RegexExtractor();
        const self = this;
        klaw(this.rootPath)
            .pipe(through2.obj(function (item, enc, next) {
                if (self.filterExcludedFiles(item.path)) {
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
                fs.readFile(
                    file.path,
                    'utf-8',
                    (err, data) => {
                        const result = regexExtractor.extract(data)
                            .map(result => {
                                const validationResult = RegexValidator.validate(result);
                                cb(file.path, validationResult);
                            });
                    },
                );
            });
    }
};
