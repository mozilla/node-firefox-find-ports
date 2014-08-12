# moz-discover-ports

Discover ports where Firefox Remote Debugging Tool is listening

## Install

```
$ npm install moz-discover-ports
```

## Usage

```javascript
var discoverPorts = require('moz-discover-ports');
console.log(discoverPorts())
// {firefox: [6000, 6080], b2g:[5421, 7654]}
```