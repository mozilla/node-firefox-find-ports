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

```javascript
var discoverPorts = require('fx-ports');
console.log(discoverPorts())
// {firefox: [6000, 6080], b2g:[5421, 7654]}
```

## Command line usage

```sh
$ fx-ports
{firefox: [6000, 6080], b2g:[5421, 7654]}

$ fx-ports --version
0.1.0

$ fx-ports --help
Usage: node fx-ports [options]

Options:
   --version   Print version and exit
```