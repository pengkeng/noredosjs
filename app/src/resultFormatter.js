module.exports.ResultFormatter = class {
    constructor(results) {
        this._results = results;
    }

    getSafeRegexCount() {
        return this._results.filter(r => r.safe).length;
    }

    getUnsafeRegexCount() {
        return this._results.filter(r => !r.safe).length;
    }

    getTotalRegexCount() {
        return this._results.length;
    }

    getLineForRegex(regex) {
        return `|${' '.repeat(4)}${regex.getLocationString()}`;
    }

    getAllRegexLines() {
        return this._results.map(r => r.toString()).join('');
    }

    getBadRegexLines() {
        return this._results.filter(r => !r.safe).map((r) => {
            return this.getLineForRegex(r.regex);
        });
    }

    getShortReport() {
        return `REGEX SAFETY REPORT
------------------------
SAFE REGEXES:\t${this.getSafeRegexCount()}
UNSAFE REGEXES:\t${this.getUnsafeRegexCount()}
${this.getBadRegexLines().join('\n')}
------------------------
TOTAL REGEXES SCANNED:\t${this.getTotalRegexCount()}
`;
    }

    getLongReport() {
        return this.getAllRegexLines() + '\n' + this.getShortReport();
    }
    
    getReport(verbose) {
        return verbose ? this.getLongReport() : this.getShortReport();
    }
};
