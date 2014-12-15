var findPorts = require('../.');

findPorts({ firefoxOSSimulator: true}, function(err, simulators) {
  var ports = simulators.map(function(simulator) {
    return simulator.port;
  });
  console.log(ports);
});
