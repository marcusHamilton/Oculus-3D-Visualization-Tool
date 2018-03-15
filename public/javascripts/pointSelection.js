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
var selectionThreshold = 1; //the distance the mouse has to be from a point
                            //in order for it to register as selectable
var intersects;

/**
 * Initializes the event listeners for point selection
 */
function initializeSelectionControls()
{
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
function pointSelectionUpdate()
{
  // calculate objects intersecting the ray
  pointSelectionRaycaster.setFromCamera(pointSelectionMouse, camera);
  intersects = pointSelectionRaycaster.intersectObject( pointsSystem );
  intersects = ( intersects.length ) > 0 ? intersects[ 0 ] : null;

  if (intersects != null) {
    //console.log(intersects.point.x + " " + intersects.point.y + " " + intersects.point.z);
    for (var i = 0; i < pointsGeometry.getAttribute('position').array.length; i++) {
      if (Math.abs(pointsGeometry.getAttribute('position').array[i].x - intersects.point.x) < selectionThreshold
        && Math.abs(pointsGeometry.getAttribute('position').array[i].y - intersects.point.y) < selectionThreshold
        && Math.abs(pointsGeometry.getAttribute('position').array[i].z - intersects.point.z) < selectionThreshold) {
        setPointColor(i, new THREE.Color(1, 1, 1));
      }
    }
  }
}

/**
 * Selects a point by setting its associated isSelected attribute
 * @param pointIndex : The array index of point you want to select in the
 *                     BufferGeometry that you want to select.
 */
function selectPoint(pointIndex)
{
  pointsGeometry.getAttribute( 'isSelected' ).array[pointIndex] =
      !pointsGeometry.getAttribute( 'isSelected' ).array[pointIndex];
  if(pointsGeometry.getAttribute( 'isSelected' ).array[pointIndex] == false){
      selectedPoints.splice(selectedPoints.indexOf(pointIndex));
      setPointColor(pointIndex, colorFromXYZcoords(pointsGeometry.getAttribute('position')).array[pointIndex]);
      setPointScale(pointIndex, pointsGeometry.getAttribute('size').array[pointIndex] =
          pointsGeometry.getAttribute('size').array[pointIndex] * 2/3);
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
  var selected = pointsGeometry.getAttribute( 'isSelected' ).array;
  for(var i = 0; i < selected.length; i++){
    if(selected[i] == true){
      selected[i] = false;
    }
  }
  pointsGeometry.getAttribute( 'isSelected' ).array = selected;
  selectedPoints = [];
}

/**
 * calculate mouse position in normalized device coordinates
 * (-1 to +1) for both components
 * @param event
 */
function onMouseMove( event ) {

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
    for (var i = 0; i < pointsGeometry.getAttribute('position').array.length; i++) {
      if (Math.abs(pointsGeometry.getAttribute('position').array[i].x - intersects.point.x) < selectionThreshold
        && Math.abs(pointsGeometry.getAttribute('position').array[i].y - intersects.point.y) < selectionThreshold
        && Math.abs(pointsGeometry.getAttribute('position').array[i].z - intersects.point.z) < selectionThreshold) {
        selectPoint(i);
      }
    }
  }
}

/**
 * Adjusts the color of a singular datapoint.
 *
 * @precondition pointsGeometry must be initialized and
 * pointsGeometry.getAttribute('customColor').needsUpdate == true
 *
 * @param {Integer} datasetIndex : index of point to change
 * @param {Vector3} colorRGB : a Vector3 of RGB values (0-1.0)
 */
function setPointColor(datasetIndex, colorRGB)
{
  pointsGeometry.getAttribute('customColor').array[datasetIndex] = colorRGB;
}

/**
 * Adjusts the scale of a singular datapoint.
 *
 * @precondition pointsGeometry must be initialized and
 * pointsGeometry.getAttribute('size').needsUpdate == true
 *
 * @param {Integer} datasetIndex : index of point to change
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

  var r = 0;
  var g = 0;
  var b = 0;
  // Truncating the first and last 16 of each value because
  // toString(16) doesn't return leading zeros.
  if (largestX > 0 && largestY > 0 && largestZ > 0) {
    r = 16 + Math.round((vec3.x / largestX) * 239);
    g = 16 + Math.round((vec3.y / largestY) * 239);
    b = 16 + Math.round((vec3.z / largestZ) * 239);
  }
  // Assemble the RGB components in a color value.
  return parseInt(r.toString(16) + g.toString(16) + b.toString(16), 16);
}