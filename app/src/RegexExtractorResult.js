module.exports.RegexExtractorResult = class {
    constructor(regex, location) {
        this._regex = regex;
        this._location = location;
    }

    get regex() {
        return this._regex;
    }

    get location() {
        return this._location;
    }

    get startLine() {
        return this._location.start.line;
    }

    get startColumn() {
        return this._location.start.column;
    }
};
