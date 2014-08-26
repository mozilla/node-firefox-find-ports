# fx-ports

Discover ports where Firefox Remote Debugging Tool is listening

## Install

```
$ npm install fx-ports
```

## Usage

```javascript
var discoverPorts = require('fx-ports');
console.log(discoverPorts())
// {firefox: [6000, 6080], b2g:[5421, 7654]}
```