# fx-ports

Discover ports where Firefox Remote Debugging Tool is listening

## Install

```
# Library
$ npm install fx-ports

# Command line
$ npm install -g fx-ports
```

## Usage

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

```javascript
var fxports = require('fx-ports');
fxports({detailed:true, b2g:true}, function(err, instances) {
  console.log("Found a B2G on", instances.port);
});
```