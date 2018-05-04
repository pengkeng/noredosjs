module.exports.RegexValidatorResult = class {
    constructor(regex, safe) {
        this._regex = regex;
        this._safe = safe;
    }

    get regex() {
        return this._regex;
    }

    get safe() {
        return this._safe;
    }
};
