# noredos.js

ReDoS checker for JavaScript

## Description

noredos.js will traverse a directory recursively, fetching all JavaScript files it finds and extracting all regexes contained therein for validation.

## Requirements

* Node
    * +v10.0.0
    * v9.0.0: pass the `--harmony-async-iteration` flag when invoking Node

## Usage

```
node index.js [flags] -- path/to/js/project
```

### Flags

* `--verbose`: print out every regex found along with its safety assessment in addition to the overall safety summary. Default: `false`
* `--silent`: do not print any output to standard output. At the moment the presence of this flag will not redirect the output anywhere else, as it's used mainly for the automated test suite. Default: `false`
* `--exclude`: exclude directory from regex search. You can pass this flag multiple times to exclude more than one directory. Default: ['.git', 'node_modules']`
* `--debug`: enable debug mode. All errors and logging statements will be shown. Default: `false`
