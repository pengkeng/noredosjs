module.exports.RegexExtractorResult = class {
    constructor(regex, location, filepath) {
        this._regex = regex;
        this._location = location;
        this._filepath = filepath;
    }

    get regex() {
        return this._regex;
    }

    get location() {
        return this._location;
    }

    get filePath() {
        return this._filepath;
    }

    get startLine() {
        return this._location.start.line;
    }

    get startColumn() {
        return this._location.start.column;
    }

    getLocationString() {
        return `[${this._filepath}:${this.startLine}:${this.startColumn}]`;
    }

    toString() {
        return this._regex;
    }
};
