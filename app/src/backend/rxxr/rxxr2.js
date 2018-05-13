const cp = require('child_process');
const fs = require('fs');

module.exports = () => {
    function validate(regexes) {
        const regexesPath = '/tmp/noredosjs-regexes.txt';
        try {
            regexesToFile(regexesPath, regexes);
        } catch (e) {
            console.log(e)
            return false;
        }

        let output = null;
        try {
            output = cp.execSync(`./src/backend/rxxr/scan.bin -i ${regexesPath}`, { encoding: 'utf-8' });
        } catch (e) {
            console.log(e);
        } finally {
            fs.unlink(regexesPath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }

        return output;
    }

    function regexesToFile(filename, regexes) {
        const text = regexes.reduce((acc, curr) => {
            return curr.regex + '\n' + acc;
        }, '');

        try {
            fs.writeFileSync(filename, text, { encoding: 'utf-8' });
        } catch (e) {
            console.log('Failed to write regexes file');
            fs.unlink(filename, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            throw new Error('Failed to write regexes file');
        }
    }

    return {
        validate,
    };
};
