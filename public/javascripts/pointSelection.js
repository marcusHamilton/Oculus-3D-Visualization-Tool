/**
 * Contains everything to do with selecting and manipulating the vertices
 * in the 3D dataset visualization.
 *
 * Much of this is based on work in Dorian Theissen's shadow manifold
 * visualization.
 **/


var selectedPoints = [];  //array containing the indices of every currently
                          //selected point.
var pointSelectionRaycaster = new THREE.Raycaster();
var pointSelectionMouse = new THREE.Vector2();
var selectionThreshold = 0; //the distance the mouse has to be from a point
//in order for it to register as selectable
var intersects;


function initializeSelectionControls()
{
  if (controller != null)
  {
    // TODO Attach raycaster to VRcontroller
  }
  // setup mouse raycaster


  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'click', onClick, false );

}


function pointSelectionUpdate()
{

  // calculate objects intersecting the ray
    pointSelectionRaycaster.setFromCamera(pointSelectionMouse, camera);
    intersects = pointSelectionRaycaster.intersectObject( pointsSystem );
    intersects = ( intersects.length ) > 0 ? intersects[ 0 ] : null;

    if (intersects != null)
    console.log(intersects.point.x + " " + intersects.point.y + " " + intersects.point.z);
    for (var i = 0; i < pointsGeometry.getAttribute('position').array.length; i++)
    {
      if (Math.abs(pointsGeometry.getAttribute('position').array[i].x - intersects.point.x) < selectionThreshold
        && Math.abs(pointsGeometry.getAttribute('position').array[i].y - intersects.point.y) < selectionThreshold
        && Math.abs(pointsGeometry.getAttribute('position').array[i].z - intersects.point.z) < selectionThreshold)
      {
        setPointColor(i, new THREE.Color(1, 1, 1));
      }
    }

}


/**
 * Selects a point by setting its associated isSelected attribute
 * @param pointIndex : The array index of point you want to select in the
 *                     BufferGeometry.
 */
function selectPoint(pointIndex)
{
  pointsGeometry.getAttribute( 'isSelected' ).array[pointIndex] =
      !pointsGeometry.getAttribute( 'isSelected' ).array[pointIndex];
  if(pointsGeometry.getAttribute( 'isSelected' ).array[pointIndex] == false){
      selectedPoints.splice(selectedPoints.indexOf(pointIndex));
      setPointColor(pointIndex, colorFromXYZcoords(pointsGeometry.getAttribute('position')).array[pointIndex]);
      setPointSize(pointIndex, pointsGeometry.getAttribute('size').array[pointIndex] =
          pointsGeometry.getAttribute('size').array[pointIndex] * 2/3);
  }
  else{
      selectedPoints.push(pointIndex);
      setPointColor(pointIndex, new THREE.Color(1, 1, 1));
      setPointSize(pointIndex, pointsGeometry.getAttribute('size').array[pointIndex] =
          pointsGeometry.getAttribute('size').array[pointIndex] * 1.5);
  }
}


function clearSelection()
{
  var selected = pointsGeometry.getAttribute( 'isSelected' ).array;
  for(var i = 0; i < selected.length; i++){
    if(selected[i] == true){
      selected[i] = false;
    }
  }
  pointsGeometry.getAttribute( 'isSelected' ).array = selected;
  selectedPoints = [];
}

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  event.preventDefault();

  pointSelectionMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointSelectionMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onClick( event ){

  event.preventDefault();
  for (var i = 0; i < pointsGeometry.getAttribute('position').array.length; i++) {
      if (Math.abs(pointsGeometry.getAttribute('position').array[i].x - intersects.point.x) < selectionThreshold
          && Math.abs(pointsGeometry.getAttribute('position').array[i].y - intersects.point.y) < selectionThreshold
          && Math.abs(pointsGeometry.getAttribute('position').array[i].z - intersects.point.z) < selectionThreshold)
      {
          selectPoint(i);
      }
  }

  if (selectedPoints.length > 0){
    console.log(getSelectedPointPositions());
  }

}

/**
 * Adjusts the color of a singular datapoint.
 *
 * @precondition pointsGeometry must be initialized and
 * pointsGeometry.getAttribute('customColor').needsUpdate == true
 *
 * @param {Number} datasetIndex : index of point to change
 * @param {THREE.Color} colorRGB : a Vector3 of RGB values (0-1.0)
 */
function setPointColor(datasetIndex, colorRGB)
{
  pointsGeometry.getAttribute('customColor').array[datasetIndex * 3] = colorRGB.r;
  pointsGeometry.getAttribute('customColor').array[(datasetIndex * 3) + 1] = colorRGB.g;
  pointsGeometry.getAttribute('customColor').array[(datasetIndex * 3) + 2] = colorRGB.b;
}

/**
 * Gets the color of a singular datapoint.
 * @precondition pointsGeometry must be initialized
 *
 * @param {Number} datasetIndex : index of point to change
 * @returns {THREE.Color} colorRGB : a Vector3 of RGB values (0-1.0)
 */
function getPointColor(datasetIndex)
{
  return new THREE.Color(
    pointsGeometry.getAttribute('customColor').array[datasetIndex * 3],
    pointsGeometry.getAttribute('customColor').array[(datasetIndex * 3) + 1],
    pointsGeometry.getAttribute('customColor').array[(datasetIndex * 3) + 2]);
}

/**
 * Adjusts the scale of a singular datapoint.
 *
 * @precondition pointsGeometry must be initialized and
 * pointsGeometry.getAttribute('size').needsUpdate == true
 *
 * @param {Number} datasetIndex : index of point to change
 * @param {Number} size : New size for  the point
 */
function setPointScale(datasetIndex, size)
{
  pointsGeometry.getAttribute('size').array[datasetIndex] = size;
}

/**
 * Computes a color hex value based on the magnitudes of the xyz values in
 * vec3 in relation to the largest value in each axis.
 *
 * @param {Vector3} vec3 a position in world space.
 *
 * @return {Number} integer color value from position.
 */
function colorFromXYZcoords(vec3) {

  // Set point color RGB values to magnitude of XYZ values
  var newColor = new THREE.Color();
  newColor.setRGB(vec3.x/largestX, vec3.y/largestY, vec3.z/largestZ);

  // Assemble the RGB components in a color value.
  return newColor;
}

/**
 * Gets an array of the xyz values of all currently selected points
 *
 * @return {Vector3[]} array of Vector3 objects containing positions
 */
function getSelectedPointPositions() {

  var selectedPointPositions = [];

  for(var i = 0; i < selectedPoints.length; i++){
    selectedPointPositions.push(pointsGeometry.getAttribute('position').array[selectedPoints[i]]);
  }

  return selectedPointPositions;
}














