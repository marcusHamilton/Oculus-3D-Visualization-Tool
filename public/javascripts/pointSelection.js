/**
 * Contains everything to do with selecting and manipulating the vertices
 * in the 3D dataset visualization.
 *
 * Much of this is based on work in Dorian Theissen's shadow manifold
 * visualization.
 **/

var selectedPoints = [];  //array containing the indices of every currently
                          //selected point.
var pointSelectionRaycaster;
var pointSelectionMouse = new THREE.Vector2();
var selectionThreshold = 0.1; //the distance the mouse has to be from a point
//in order for it to register as selectable
var intersects;

/**
 * Initializes the event listeners for point selection
 */
function initializeSelectionControls()
{
  console.log("Point Selection Threshold: " + selectionThreshold);
  pointSelectionRaycaster = new THREE.Raycaster();
  pointSelectionRaycaster.params.Points.threshold = selectionThreshold;

  if (controller != null)
  {
    // TODO Attach raycaster to VRcontroller
  }
  // setup mouse raycaster here

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'click', onClick, false );
}

/**
 * Call this in GameLoop or Update to detect raycaster intersections on every
 * frame.
 */
var mousedOverPoint;
function pointSelectionUpdate()
{
  // calculate objects intersecting the ray
  pointSelectionRaycaster.setFromCamera(pointSelectionMouse, camera);
  intersects = pointSelectionRaycaster.intersectObject( pointsSystem );
  intersects = ( intersects.length ) > 0 ? intersects[ 0 ] : null;
  setPointScale(mousedOverPoint, plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ));
  //pointsGeometry.boundingBox = null;
  if (intersects != null) {
    //console.log(intersects.point.x + " " + intersects.point.y + " " + intersects.point.z);
    //console.log(intersects);
    setPointScale(intersects.index, plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ) * 2);

    mousedOverPoint = intersects.index;
    //var curColor = getPointColor(intersects.index);
    //pointsGeometry.getAttribute('customColor').array[intersects.index * 3] = 1;
    //pointsGeometry.getAttribute('customColor').array[(intersects.index * 3) + 1] = 1;
    //pointsGeometry.getAttribute('customColor').array[(intersects.index * 3) + 2] = 1;
    //console.log(getPointColor(intersects.index));
    //setPointColor(intersects.index, new THREE.Color(255,255,255));
    //setPointColor(intersects.index, curColor.setHSL(curColor.getHSL.h, curColor.getHSL.s, curColor.getHSL.l * 1.5 ));

  }
  else {

    setPointScale(mousedOverPoint, plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ));
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
    selectedPoints.splice(selectedPoints.indexOf(pointIndex),1);
    setPointColor(pointIndex, colorFromXYZcoords(new THREE.Vector3(
      pointsGeometry.getAttribute('position').array[(pointIndex*3)],
      pointsGeometry.getAttribute('position').array[(pointIndex*3)+1],
      pointsGeometry.getAttribute('position').array[(pointIndex*3)+2])));
    setPointScale(pointIndex, pointsGeometry.getAttribute('size').array[pointIndex] =
      plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ));
  }
  else{
    selectedPoints.push(pointIndex);
    setPointColor(pointIndex, new THREE.Color(1, 1, 1));
    setPointScale(pointIndex, pointsGeometry.getAttribute('size').array[pointIndex] =
      pointsGeometry.getAttribute('size').array[pointIndex] * 1.5);
  }

}

/**
 * Clears all selected points
 */
function clearSelection()
{
  var printArrayAfter = false;
  if (selectedPoints.length > 0){
    printArrayAfter = true;
  }
  var selected = pointsGeometry.getAttribute( 'isSelected' ).array;
  for(var i = 0; i < selected.length; i++){
    if(selected[i] == true){
      selected[i] = false;
      setPointColor(i, colorFromXYZcoords(new THREE.Vector3(
        pointsGeometry.getAttribute('position').array[(i*3)],
        pointsGeometry.getAttribute('position').array[(i*3)+1],
        pointsGeometry.getAttribute('position').array[(i*3)+2])));
    }
  }
  pointsGeometry.getAttribute( 'isSelected' ).array = selected;
  selectedPoints = [];
  if (printArrayAfter){
    console.log(selectedPoints);
  }
}

/**
 * calculate mouse position in normalized device coordinates
 * (-1 to +1) for both components
 * @param event
 */
function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  event.preventDefault();

  pointSelectionMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointSelectionMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

/**
 * Calls selectPoint for the first vertex that intersects the selction
 * raycaster.
 * @param event
 */
function onClick( event ){

  event.preventDefault();
  if (intersects != null) {
    selectPoint(intersects.index);
  }
  else {
    clearSelection();
  }
  if (selectedPoints.length > 0){
    //console.log(selectedPoints);
    console.log(getSelectedPointPositions());
  }

}

/**
 * Adjusts the color of a singular datapoint.
 *
 * @precondition pointsGeometry must be initialized and
 * pointsGeometry.getAttribute('customColor').needsUpdate == true
 *
 * param {Number} datasetIndex : index of point to change
 * @param {THREE.Color} colorRGB : a Vector3 of RGB values (0-1.0)
 */
function setPointColor(datasetIndex, colorRGB)
{
  pointsGeometry.getAttribute('customColor').array[datasetIndex * 3] = colorRGB.r;
  pointsGeometry.getAttribute('customColor').array[(datasetIndex * 3) + 1] = colorRGB.g;
  pointsGeometry.getAttribute('customColor').array[(datasetIndex * 3) + 2] = colorRGB.b;
}

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
 * param {Number} datasetIndex : index of point to change
 * param {Number} size : New size for  the point
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














