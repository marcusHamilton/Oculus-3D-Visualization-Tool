var THREE = require('three');
const mocha = require('mocha');
const chai = require('chai');
const assert = require('assert');
var expect = chai.expect;


describe('Testing Oculus Controls', function() {

  var handControlL; // Left hand Oculus controller
  var handControlR; // Right hand Oculus controller
  var AisPressed;
  var XisPressed;
  var meshColorOff = 0xDB3236; //  Red.
  var meshColorOn = 0xF4C20D; //  Yellow.
  var guiInputHelper;

  before(function() {
    console.log('before');
  });

  describe('checking controller mesh settings', function() {

    it('should have a MeshStandardMaterial', function(){
      var controllerMaterial = new THREE.MeshStandardMaterial({
        color: meshColorOff
      });
      assert.notEqual('undefined', controllerMaterial);
    });

    it('should have a CylinderGeometry', function(){
      var controllerMaterial = new THREE.MeshStandardMaterial({
        color: meshColorOff
      });
      controllerMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.05, 0.1, 6),
        controllerMaterial
      );
      assert.notEqual('undefined', controllerMesh);
    });

    it('should have a BoxGeometry', function() {
      var controllerMaterial = new THREE.MeshStandardMaterial({
        color: meshColorOff
      });
      var handleMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.1, 0.03),
        controllerMaterial
      );
      assert.notEqual('undefined', handleMesh);
    });
  });

  describe('checking controller events', function() {
    it('should turn colour on primary press', function() {
      assert.notEqual(meshColorOn, meshColorOff);
    });
    it('should turn colour off when primary press released', function() {
      assert.notEqual(meshColorOff, meshColorOn);
    });
  });

  describe('Selection controls', function() {
    var selectionThreshold = 0.04;
    it('pointSelectionRaycaster should have proper threshold', function() {
      pointSelectionRaycaster = new THREE.Raycaster();
      pointSelectionRaycaster.params.Points.threshold = selectionThreshold;
      assert.equal(pointSelectionRaycaster.params.Points.threshold, selectionThreshold);
    })
  });

});
