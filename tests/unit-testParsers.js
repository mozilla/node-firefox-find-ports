// Unit tests for the operating-system specific parsers.
// No need to run them on actual environments per se, as we are checking for
// the correctly returned type, and using test data already, etc.

var fs = require('fs');
var path = require('path');
var testsPath = path.dirname(__filename);
var parsers = require('../lib/parsers');
var oses = Object.keys(parsers);
var searchAll = ['firefox', 'b2g'];
var MARIONETTE_PORT = 2828;

var darwinOutput = fs.readFileSync(testsPath + '/data/darwin.txt', 'utf-8');
var linuxOutput = fs.readFileSync(testsPath + '/data/linux.txt', 'utf-8');

function getPortNumbers(results) {
  var portNumbers = [];
  results.forEach(function(result) {
    portNumbers.push(result.port);
  });
  return portNumbers;
}

module.exports = {

  emptyInputReturnsArray: function(test) {
    test.expect(oses.length);

    var lines = [];

    oses.forEach(function(osname) {
      var parser = parsers[osname];
      var ports = parser(lines, searchAll);
      test.ok(ports && ports instanceof Array);
    });

    test.done();
  },

  somethingElseReturnsArrayToo: function(test) {
    test.expect(oses.length);

    var lines = ['one', 'two', 'whatever'];

    oses.forEach(function(osname) {
      var parser = parsers[osname];
      var ports = parser(lines, searchAll);
      test.ok(ports && ports instanceof Array);
    });

    test.done();

  },

  // test no marionette ports are returned
  noMarionettePortsReturned: function(test) {

    var sets = [
      { output: darwinOutput, parser: parsers.darwin },
      { output: linuxOutput, parser: parsers.linux }
    ];

    test.expect(sets.length);

    sets.forEach(function(resultSet) {
      var lines = resultSet.output.split('\n');
      var result = resultSet.parser(lines, searchAll);
      var resultPorts = getPortNumbers(result);
      test.ok(resultPorts.indexOf(MARIONETTE_PORT) === -1);
    });

    test.done();

  },

  // test b2g simulator port is returned
  // The expected port is what we got when preparing the data file,
  // but it doesn't mean that all simulators have to use that port!
  b2gSimulatorPortReturned: function(test) {
    var sets = [
      { output: darwinOutput, parser: parsers.darwin, expectedPort: 54637 },
      { output: linuxOutput, parser: parsers.linux, expectedPort: 37566 }
    ];

    test.expect(sets.length);

    sets.forEach(function(resultSet) {
      var lines = resultSet.output.split('\n');
      var result = resultSet.parser(lines, searchAll);
      var resultPorts = getPortNumbers(result);
      test.ok(resultPorts.indexOf(resultSet.expectedPort) !== -1);
    });

    test.done();

  }
  // test firefox instances
  // test when no debuggable runtime ports are present
  // test adb-bridged devices (?)

};

