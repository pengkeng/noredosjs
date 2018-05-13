const util = require('util');
const fs = require('fs');
const path = require('path');
const klawSync = require('klaw-sync');
const through2 = require('through2');

const { RegexExtractor } = require('./regexExtractor');
const RegexValidator = require('./backend/default/regexValidator')();
const RxxrValidator = require('./backend/rxxr/rxxr2')();

module.exports.FileWalker = class {
    constructor(logger, rootPath, exclude) {
        this._logger = logger;
        this.rootPath = rootPath;
        this.exclude = exclude;
    }

    filterExcludedFiles(absPath) {
        const filePath = path.relative(this.rootPath, absPath);
        return this.exclude.find((excludedPath, idx) => {
            return filePath.indexOf(excludedPath) !== -1;
        }) === undefined;
    }

    async validateWithDefault() {
        let results = [];
        for await (const result of this.walk()) {
            results = results.concat(result);
        }

        return results;
    }

    async validateWithRxxr() {
        return this.runRxxr();
    }

    async runRxxr() {
        if (!this.rootPath || this.rootPath === '') {
            this.rootPath = './';
        }

        const regexExtractor = new RegexExtractor(this._logger);

        const self = this;
        const files = klawSync(this.rootPath)
            .filter(file => self.filterExcludedFiles(file.path))
            .filter(file => path.extname(file.path) === '.js');

        const readFile = util.promisify(fs.readFile);

        const regexes = [];
        for (const file of files) {
            const data = await readFile(file.path, 'utf-8');
            const shortPath = path.relative(__dirname, file.path);
            const results = regexExtractor.extract(shortPath, data);

            results.forEach((r) => {
                regexes.push(r);
            });
        }

        return RxxrValidator.validate(regexes);
    }

    async * walk() {
        if (!this.rootPath || this.rootPath === '') {
            this.rootPath = './';
        }

        const regexExtractor = new RegexExtractor(this._logger);
        const self = this;
        const files = klawSync(this.rootPath)
            .filter(file => self.filterExcludedFiles(file.path))
            .filter(file => path.extname(file.path) === '.js');

        const readFile = util.promisify(fs.readFile);

        for (const file of files) {
            const data = await readFile(file.path, 'utf-8');
            const shortPath = path.relative(__dirname, file.path);
            const results = regexExtractor.extract(shortPath, data)
                .map(result => RegexValidator.validate(result));

            for (const result of results) {
                yield result;
            }
        }
    }
};
