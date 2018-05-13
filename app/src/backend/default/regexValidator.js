const isSafe = require('safe-regex');
const { RegexValidatorResult } = require('./regexValidatorResult');

module.exports = () => {
    function validate(regexResult) {
        return new RegexValidatorResult(regexResult, isSafe(regexResult.regex));
    }

    return {
        validate,
    };
}
