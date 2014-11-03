# node-firefox-ports

> Find out the ports where Firefox Desktop and Firefox OS remote debugging tools are listening.

This is part of the [node-firefox](https://github.com/mozilla/node-firefox) project.

(based on initial work on [fx-ports](https://github.com/nicola/fx-ports) by Nicola Greco).

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

<!---
## Install

```sh
# Library
$ npm install fx-ports

# Command line
$ npm install -g fx-ports
```

## Usage

#### Command line

```sh
$ fx-ports --help

Usage: node fx-ports [options]

Options:
   --version    Print version and exit
   --b2g        Show Boot2Gecko (FirefoxOS) listening ports only
   --detailed   Show details of each Remote Debugger
   --firefox    Show Firefox Desktop listening ports only
   --json       Formats in json
```

#### Node library

```javascript
var fxports = require('fx-ports');
fxports({detailed:true, b2g:true}, function(err, instances) {
  console.log("Found a B2G on", instances.port);
});
```
-->
