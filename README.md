# jsnoredos

ReDoS checker for JavaScript

## Description

jsnoredos will traverse a directory recursively, fetching all JavaScript files it finds and extracting all regexes contained therein for validation.

## Requirements

For Node v10.0.0+, you can just launch the app. If you're running an earlier version, you may need to pass the `--harmony-async-iteration` flag to Node.

## Usage

```
node index.js path/to/js/project
```
