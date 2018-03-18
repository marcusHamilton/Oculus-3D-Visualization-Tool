//Testing for selection of individual points using BufferGeometries.

var assert = require('chai').assert;
var should = require('chai').should();
var THREE  = require('../../public/javascripts/three/three.js');
var ps = require('../../public/javascripts/pointSelection.js');
var load = require('../../public/javascripts/loadWorld.js');

//set up the test scene
var loader = new THREE.ObjectLoader();
var scene = new THREE.Scene();
var sceneData = require('../../dev_helpers/sinTestScene.json');
var object = loader.parse(sceneData);
scene.add(object);

loadedDataset = object.userData;
load.drawDataset(loadedDataset[0][0],loadedDataset[0][1],loadedDataset[0][2]);

it("should select the proper point", () =>{
    //select index 1, 4, 9 in the dataset
    ps.selectPoint(1);
    ps.selectPoint(4);
    ps.selectPoint(9);
    assert(pointsGeometry.getAttribute( 'isSelected' ).array[1] === true);
    assert(pointsGeometry.getAttribute( 'isSelected' ).array[4] === true);
    assert(pointsGeometry.getAttribute( 'isSelected' ).array[9] === true);

    assert(selectedPoints.length === 3);

});



