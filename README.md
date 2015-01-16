# node-firefox-find-ports [![Build Status](https://secure.travis-ci.org/mozilla/node-firefox-find-ports.png?branch=master)](http://travis-ci.org/mozilla/node-firefox-find-ports)

> Find ports where debuggable runtimes are listening.

[![Install with NPM](https://nodei.co/npm/node-firefox-find-ports.png?downloads=true&stars=true)](https://nodei.co/npm/node-firefox-find-ports/)

This is part of the [node-firefox](https://github.com/mozilla/node-firefox) project.

When runtimes have remote debugging enabled, they start a server that listens for incoming connections. This module can find those runtimes and in which port they are listening.

## Current limitations

We can only detect **Firefox Desktop** and **Firefox OS Simulators**. Devices connected via USB are exposed via adb, which makes differentiation difficult with the method we are using to detect runtimes.

We also do not support Windows yet--we have no parser, tests or test data for Windows. But there are placeholders in the code marked with `TODO: Windows` that indicate where the Windows code would need to be added. If you want to contribute, those are the *gaps* that need to be filled in order for this to work on Windows.

## Installation

### From git

```bash
git clone https://github.com/mozilla/node-firefox-find-ports.git
cd node-firefox-find-ports
npm install
```

If you want to update later on:

```bash
cd node-firefox-find-ports
git pull origin master
npm install
```

### npm

```bash
npm install node-firefox-find-ports
```

## Usage

```javascript
findPorts(options) // returns a Promise
```

where `options` is a plain Object with any of the following:

* `firefox`: look for Firefox Desktop instances
* `firefoxOSSimulator`: look for Firefox OS Simulators
* `detailed`: query each found runtime for more information, such as the version, build time, processor, etc. The additional data will be added to the entry under a new `device` field.

If no `options` are provided, or if `options` is an empty `Object` (`{}`), then `findPorts` will look for any runtimes, of any type.

### Finding ports

```javascript
var findPorts = require('node-firefox-find-ports');

// Return all listening runtimes
findPorts().then(function(results) {
  console.log(results);
});

// Returns only Firefox OS simulators, this time with error handling
findPorts({ firefoxOSSimulator: true }).then(function(results) {
  console.log(results);
}, function(err) {
  console.log(err);
});

// Returns only Firefox OS simulators, with extra detailed output
findPorts({ firefoxOSSimulator: true, detailed: true }).then(function(results) {
  console.log(results);
});
```

## Running the tests

After installing, you can simply run the following from the module folder:

```bash
npm test
```

To add a new unit test file, create a new file in the `tests/unit` folder. Any file that matches `test.*.js` will be run as a test by the appropriate test runner, based on the folder location.

We use `gulp` behind the scenes to run the test; if you don't have it installed globally you can use `npm gulp` from inside the project's root folder to run `gulp`.

### Code quality and style

Because we have multiple contributors working on our projects, we value consistent code styles. It makes it easier to read code written by many people! :-)

Our tests include unit tests as well as code quality ("linting") tests that make sure our test pass a style guide and [JSHint](http://jshint.com/). Instead of submitting code with the wrong indentation or a different style, run the tests and you will be told where your code quality/style differs from ours and instructions on how to fix it.

## History

This is based on initial work on [fx-ports](https://github.com/nicola/fx-ports) by Nicola Greco.

The command line utility binary has been removed for this initial iteration, since pretty much all the existing applications using this module were just using the JS code directly, not the binary.

## License

This program is free software; it is distributed under an
[Apache License](https://github.com/mozilla/node-firefox-find-ports/blob/master/LICENSE).

## Copyright

Copyright (c) 2014 [Mozilla](https://mozilla.org)
([Contributors](https://github.com/mozilla/node-firefox-find-ports/graphs/contributors)).
