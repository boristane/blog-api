# blog-api
The API for my blog, art portfolio and projects page.

## Install

```bash
npm i
```

## Run

```bash
npm start
```

## Testing

There are three commands for running the tests.

**Please make sure the server is not running before running the tests.**

### Regular testing
```bash
npm run test
```
This will run all the testing suites and print the result in the command line.

### Continious Integration testing

```bash
npm run test-ci
```
This will run the testing for Continious Integration. In addition to the command line print of the test results, reports will be produced for the coverage and the testing results in machine readable format. 

The reports are found in the folders `coverage` and `reports`.

### Recent files testing
```bash
npm run test-changed
```
This will run tests only for the files changed since the last commit.