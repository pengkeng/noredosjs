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
node index.js path/to/js/project
```
