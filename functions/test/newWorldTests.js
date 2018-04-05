
// have some test parsed data
// import function that builds the world
// verify the scene object is correct
/*
  1. Make a file with test data (output from papa-parse).
  2. Make a file with the scene JSON generated from the test file.
  3. Add both files to module.exports and require in this file.
  4. Test newWorld.js functions in Mocha to verify that the results match the results file.
*/

// var THREE = require("three-js")();
const assert = require('chai').assert;
const chai = require('chai');
var expect = chai.expect;
const mocha = require('mocha');
const sinon = require('sinon');

var newWorld = require('../../public/javascripts/newWorld.js');
var THREE = newWorld.THREE;

var writeWorldStub = sinon.stub();
// console.log('newWorld is: ' + Object.keys(newWorld));

function writeWorld(json){
  return null;
}

function reloadWorlds(){
  return null;
}

describe('testing newWorld.js', function(){

  describe('verify parsed data is loaded into scene correctly', function(){

    before(function(){
      var parsedData = ['index', "x", "y", "z",1,1,1,1,2,2,2,2,3,3,3,3,]
      newWorld.setParsedData(parsedData);
      newWorld.setXAxisIndex(1);
      newWorld.setYAxisIndex(2);
      newWorld.setZAxisIndex(3);
      newWorld.setSceneForTesting();

      sceneUserData = [[1,2,3],'index', "x", "y", "z",1,1,1,1,2,2,2,2,3,3,3,3,]
    });

    it('should be correct in scene.userData', function(){
      newWorld.addParsedDataToScene();
      expect(newWorld.getScene().userData).to.deep.equal(sceneUserData)

    });
  })

});


/*
parsed data: index, "x", "y", "z",1,1,1,1,2,2,2,2,3,3,3,3,
scene.userData: 1,2,3,index, "x", "y", "z",1,1,1,1,2,2,2,2,3,3,3,3,
*/
