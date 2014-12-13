# node-firefox-ports

> Find ports where debuggable runtimes are listening.

This is part of the [node-firefox](https://github.com/mozilla/node-firefox) project.

When runtimes have remote debugging enabled, they start a server that listens for incoming connections. This module can find those runtimes and in which port they are listening.

## Current limitations

We can only detect **Firefox Desktop** and **Firefox OS Simulators**. Devices connected via USB are exposed via adb, which makes differentiation difficult with the method we are using to detect runtimes.

We also do not support Windows yet--we have no parser, tests or test data for Windows. But there are placeholders in the code marked with `TODO: Windows` that indicate where the Windows code would need to be added. If you want to contribute, those are the *gaps* that need to be filled in order for this to work on Windows.

**NOTE**

*This is a work in progress. Things will probably be missing and broken while we move from `fx-ports` to `firefox-ports`. Please have a look at the [existing issues](https://github.com/mozilla/node-firefox-ports/issues), and/or [file more](https://github.com/mozilla/node-firefox-ports/issues/new) if you find any! :-)*

## Installation

### From git

```bash
git clone https://github.com/mozilla/node-firefox-ports.git
cd node-firefox-ports
npm install
```

If you want to update later on:

```bash
cd node-firefox-ports
git pull origin master
npm install
```

### npm

This module is not on npm yet.

## Usage

### Finding ports

```javascript
var firefoxPorts = require('./node-firefox-ports');
// (or require('node-firefox-ports') when it's on npm)

// Return all listening runtimes
firefoxPorts({}, function(err, results) {
  console.log(results);
});
```

### Running the tests

After installing, you can simply run the following from the module folder:

```bash
npm test
```

If everything is in order, the tests shall pass.

## History

This is based on initial work on [fx-ports](https://github.com/nicola/fx-ports) by Nicola Greco.

The command line utility binary has been removed for this initial iteration, since pretty much all the existing applications using this module were just using the JS code directly, not the binary.
