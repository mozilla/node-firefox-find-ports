'use strict';

// Unit tests for the operating-system specific parsers.
// No need to run them on actual environments per se, as we are checking for
// the correctly returned type, and using test data already, etc.

var fs = require('fs');
var path = require('path');
var testsPath = path.dirname(__filename);
var parsers = require('../../lib/parsers');
var oses = Object.keys(parsers);
var searchAll = ['firefox', 'b2g'];
var MARIONETTE_PORT = 2828;

var darwinSimulatorOutput = fs.readFileSync(testsPath + '/data/darwin-simulator.txt', 'utf-8');
var darwinFirefoxOutput = fs.readFileSync(testsPath + '/data/darwin-firefox.txt', 'utf-8');
var darwinNoRuntimesOutput = fs.readFileSync(testsPath + '/data/darwin-no-runtimes.txt', 'utf-8');
var linuxSimulatorOutput = fs.readFileSync(testsPath + '/data/linux-simulator.txt', 'utf-8');
var linuxFirefoxOutput = fs.readFileSync(testsPath + '/data/linux-firefox.txt', 'utf-8');
var linuxNoRuntimesOutput = fs.readFileSync(testsPath + '/data/linux-no-runtimes.txt', 'utf-8');
// TODO: Windows test data

function getPortNumbers(results) {
  var portNumbers = [];
  results.forEach(function(result) {
    portNumbers.push(result.port);
  });
  return portNumbers;
}

module.exports = {

  // Test that the output of the parser is always an array,
  // even if the input is an empty array of lines
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


  // Test that the output of the parser is an array,
  // even if the input is not 'right' - avoids massive breakages if
  // the commands failed for any reason
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


  // Test no marionette ports are returned
  noMarionettePortsReturned: function(test) {

    var sets = [
      { output: darwinSimulatorOutput, parser: parsers.darwin },
      { output: linuxSimulatorOutput, parser: parsers.linux }
      // TODO: Windows
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


  // Test b2g simulator port is returned
  // The expected port is what we got when preparing the data file,
  // but it doesn't mean that all simulators have to use that port!
  b2gSimulatorPortReturned: function(test) {

    var sets = [
      { output: darwinSimulatorOutput, parser: parsers.darwin, expectedPort: 54637 },
      { output: linuxSimulatorOutput, parser: parsers.linux, expectedPort: 37566 }
      // TODO: Windows
    ];

    test.expect(sets.length);

    sets.forEach(function(resultSet) {
      var lines = resultSet.output.split('\n');
      var result = resultSet.parser(lines, searchAll);
      var resultPorts = getPortNumbers(result);
      test.ok(resultPorts.indexOf(resultSet.expectedPort) !== -1);
    });

    test.done();

  },


  // Test the port for firefox instances listening for debugging is returned
  firefoxPortReturned: function(test) {

    var sets = [
      { output: darwinFirefoxOutput, parser: parsers.darwin, expectedPort: 6000 },
      { output: linuxFirefoxOutput, parser: parsers.linux, expectedPort: 6000 }
      // TODO: Windows
    ];

    test.expect(sets.length);

    sets.forEach(function(resultSet) {
      var lines = resultSet.output.split('\n');
      var result = resultSet.parser(lines, searchAll);
      var resultPorts = getPortNumbers(result);
      test.ok(resultPorts.indexOf(resultSet.expectedPort) !== -1);
    });

    test.done();

  },


  // Test when no debuggable runtime ports are present, no ports are found
  // and the array length is 0
  noRuntimeAvailableNoPortReturned: function(test) {
    var sets = [
      { output: darwinNoRuntimesOutput, parser: parsers.darwin },
      { output: linuxNoRuntimesOutput, parser: parsers.linux }
      // TODO: Windows
    ];

    test.expect(sets.length);

    sets.forEach(function(resultSet) {
      var lines = resultSet.output.split('\n');
      var result = resultSet.parser(lines, searchAll);
      var resultPorts = getPortNumbers(result);
      test.ok(resultPorts.length === 0);
    });

    test.done();

  }


  // TODO: test adb-bridged devices (?)
  // Seems like the output of lsof for 'normal adb' ports doesn't
  // differ from 'forwarded' ports (as in, forwarding Android from
  // USB to local port using ADB), so I don't really know if we can
  // do this.

};

