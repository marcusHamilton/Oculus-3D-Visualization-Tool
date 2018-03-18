/*

//Testing for selection of individual points using BufferGeometries.

var assert = require('chai').assert;
var should = require('chai').should();
//var THREE  = require('../../public/javascripts/three/three.js');
var ps = require('../../public/javascripts/pointSelection.js');
var THREE = ps.THREE;
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

    //only three points should be selected
    assert(selectedPoints.length === 3);

});

it("should select all points on selectAll()", () =>{
   ps.selectAll();

   for(var i = 0; i < pointsGeometry.getAttribute( 'isSelected' ).array.length; i++){
       assert(pointsGeometry.getAttribute( 'isSelected' ).array[i] === true);
   }

   assert(selectedPoints.length === pointsGeometry.getAttribute( 'isSelected' ).array.length);
});

it('should clear all selected points on clearSelection()', () =>{
    ps.selectPoint(1);
    ps.selectPoint(4);
    ps.selectPoint(9);

    ps.clearSelection();

    for(var i = 0; i < pointsGeometry.getAttribute( 'isSelected' ).array.length; i++){
        assert(pointsGeometry.getAttribute( 'isSelected' ).array[i] === false);
    }

    assert(selectedPoints.length === 0);
});

it("selection should be inverted on invertSelection()", ()=>{
    ps.selectPoint(1);
    ps.selectPoint(4);
    ps.selectPoint(9);

    for(var i = 0; i < pointsGeometry.getAttribute( 'isSelected' ).array.length; i++){
        if(i == 1 || i == 4 || i == 9 ){
            assert(pointsGeometry.getAttribute( 'isSelected' ).array[i] === false);
        }
        else{
            assert(pointsGeometry.getAttribute( 'isSelected' ).array[i] === true);
        }
    }


    assert(selectedPoints.length === pointsGeometry.getAttribute( 'isSelected' ).array.length - 3);
});
*/
