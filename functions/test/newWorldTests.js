
// have some test parsed data
// import function that builds the world
// verify the scene object is correct
/*
  1. Make a file with test data (output from papa-parse).
  2. Make a file with the scene JSON generated from the test file.
  3. Add both files to module.exports and require in this file.
  4. Test newWorld.js functions in Mocha to verify that the results match the results file.
*/

const assert = require('chai').assert;
const mocha = require('mocha');

var newWorld = require('../../public/javascripts/newWorld.js');

describe('testing newWorld.js', function(){
  it('should print testing', function(){
    console.log('testing');

  });
});
