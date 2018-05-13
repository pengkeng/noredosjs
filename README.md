# noredos.js

ReDoS checker for JavaScript

## Description

noredos.js will traverse a directory recursively, fetching all JavaScript files it finds and extracting all regexes contained therein for validation.

## Requirements

* Node
    * +v10.0.0
    * v9.0.0: pass the `--harmony-async-iteration` flag when invoking Node
* (rxxr2 backend only) OCaml

## Example

Scanning noredos.js (this project!) for any unsafe regexes, including all of its dependencies.

```
$ node index.js
STARTING SCAN...
REGEX SAFETY REPORT
------------------------
SAFE REGEXES:   264
UNSAFE REGEXES: 27
|    ../node_modules/brace-expansion/index.js:106:26
|    ../node_modules/brace-expansion/index.js:107:24
|    ../node_modules/cycle/cycle.js:128:8
|    ../node_modules/diff/dist/diff.js:1004:20
|    ../node_modules/diff/dist/diff.js:1059:45
|    ../node_modules/diff/dist/diff.min.js:259:6
|    ../node_modules/diff/dist/diff.min.js:272:44
|    ../node_modules/diff/lib/patch/parse.js:27:19
|    ../node_modules/diff/lib/patch/parse.js:82:44
|    ../node_modules/minimatch/minimatch.js:524:24
|    ../node_modules/minimist/index.js:93:19
|    ../node_modules/mocha/lib/ms.js:39:15
|    ../node_modules/mocha/mocha.js:1714:15
|    ../node_modules/mocha/mocha.js:10050:20
|    ../node_modules/mocha/mocha.js:10105:45
|    ../node_modules/mocha/mocha.js:11846:14
|    ../node_modules/ms/index.js:52:14
|    ../node_modules/ret/lib/index.js:204:17
|    ../node_modules/safe-regex/test/regex.js:22:4
|    ../node_modules/safe-regex/test/regex.js:24:4
|    ../node_modules/safe-regex/test/regex.js:25:4
|    ../node_modules/safe-regex/test/regex.js:26:4
|    ../node_modules/safe-regex/test/regex.js:27:4
|    ../node_modules/safe-regex/test/regex.js:28:4
|    ../node_modules/stack-trace/lib/stack-trace.js:42:33
|    ../node_modules/winston/lib/winston/logger.js:225:15
|    ../test/data/testBasic/bad/badRegexes.js:1:15
------------------------
TOTAL REGEXES SCANNED:  291
```

## Usage

```
node index.js [flags] -- path/to/js/project
```

### Flags

* `--verbose`: print out every regex found along with its safety assessment in addition to the overall safety summary. Default: `false`
* `--silent`: do not print any output to standard output. At the moment the presence of this flag will not redirect the output anywhere else, as it's used mainly for the automated test suite. Default: `false`
* `--exclude`: exclude directory from regex search. You can pass this flag multiple times to exclude more than one directory. To include all directories, including those removed by default, pass the `--exclude` flag without arguments to the application. Default: ['.git', 'node_modules']`
* `--debug`: enable debug mode. All errors and logging statements will be shown. Default: `false`
* `--backend`: choose regex validation backend to use. Available backends are `default` and `rxxr`. See the backends section for an explanation of these. Default: `default`

## Backends

### Default

The default regex validation backend makes use of [https://www.npmjs.com/package/safe-regex](safe-regex), which will generate a report with the number of safe and unsafe regexes that were found, and will optionally print them all out, if the `--verbose` flag is passed. This engine is selected by default as it is very fast and stable.

### rxxr

The rxxr backend is powered by the [http://www.cs.bham.ac.uk/~hxt/research/rxxr2/](rxxr2 static analyser), which will carry out a more exhaustive analysis of the regexes in your project, providing more information than the default backend will do. However, be warned this engine is slower and more costly to run than the default engine and is prone to run out of memory when given certain inputs.
