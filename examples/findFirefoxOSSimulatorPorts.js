'use strict';

var discoverPorts = require('../index.js');

discoverPorts({b2g: true}, function(err, simulators) {
  var ports = simulators.map(function(simulator) {
    return simulator.port;
  });

  console.log(ports);
});
