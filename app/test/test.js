const assert = require('assert');
const fs = require('fs');

const App = require('../src/app');

describe('App', () => {
    const testBasePath = './test/data';
    let rootPath;
    let excludes;

    let app;
    let actual;

    beforeEach(() => {
        excludes = [ '.git', 'node_modules' ];
    });

    context('Basic Validation', () => {
        rootPath = `${testBasePath}/testBasic`;

        it('should ok all safe regexes', async () => {
            actual = await App().run(`${rootPath}/good`, excludes, false);
            actual.forEach((result) => {
                assert.equal(result.safe, true);
            });
        });

        it('should reject all unsafe regexes', async () => {
            actual = await App().run(`${rootPath}/bad`, excludes, false);
            actual.forEach((result) => {
                assert.equal(result.safe, false);
            });
        });
    });
});
