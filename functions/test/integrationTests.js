var THREE = require('three');
const mocha = require('mocha');
const chai = require('chai');
const assert = require('assert');
var expect = chai.expect;
var jsdom = require('mocha-jsdom');


describe('Integration tests', function() {
  scene = new THREE.Scene();

  describe('Creating a scene', function(){
    // jsdom();

    it('should exist', function() {
      assert.notEqual('undefined', scene);
      // console.log(window.innerWidth);
    });

  });

  describe('Loading csv data', function(){

    it('should contain the parsed csv data', function(){
      scene.userData = [["1","2","3"],["index"," \"x\""," \"y\""," \"z\""],[1,1,1,1],[2,2,2,2],[3,3,3,3],[""]];
      assert.notEqual('undefined', scene.userData);
    });
  });

});
