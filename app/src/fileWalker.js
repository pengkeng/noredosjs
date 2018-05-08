const util = require('util');
const fs = require('fs');
const path = require('path');
const klawSync = require('klaw-sync');
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

    async validate() {
        let results = [];
        for await (const result of this.walk()) {
            results = results.concat(result);
        }

        return results;
    }

    async * walk() {
        if (!this.rootPath || this.rootPath === '') {
            this.rootPath = './';
        }

        const regexExtractor = new RegexExtractor();
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
