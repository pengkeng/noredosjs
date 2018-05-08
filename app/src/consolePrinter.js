module.exports = (stdout) => {
    function print(message) {
        if (stdout) {
            console.log(message);
        }
    }

    return {
        print,
    };
}
