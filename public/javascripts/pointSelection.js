/**
 * Contains everything to do with selecting and manipulating the vertices
 * in the 3D dataset visualization.
 *
 * Much of this is based on work in Dorian Theissen's shadow manifold
 * visualization.
 **/

var selectedPoints = [];  //array containing the indices of every currently
                          //selected point.
var hiddenPoints = [];

var pointSelectionMouse = new THREE.Vector2();
var selectionThreshold = 0.04; //the distance the mouse has to be from a point
//in order for it to register as selectable
var intersects;


var selectionControllerL;
var selectionControllerR;

var pointSelectionRaycasterL;
var pointSelectionRaycasterR;
var raycasterLine;
var isRaycasterLineActive;
/**
 * Initializes the event listeners for point selection
 */

function initializeSelectionControls()
{
  isRaycasterLineActive = false;
  console.log("Initializing Selection Controls ... Point Selection Threshold: " + selectionThreshold);
  pointSelectionRaycaster = new THREE.Raycaster();
  pointSelectionRaycaster.params.Points.threshold = selectionThreshold;

  selectionControllerL = scene.getObjectByName("Oculus Touch (Left)");
  selectionControllerR = scene.getObjectByName("Oculus Touch (Right)");

  // We were originally going to allow selection with the left controller,
  // But I think we'll probably limit it to the right control, and have tools
  // on this one.
  if (selectionControllerL){
    console.log("Left VR Controller detected for point selection.");
    console.log(selectionControllerL);
    pointSelectionRaycasterL = new THREE.Raycaster();
    pointSelectionRaycasterL.params.Points.threshold = selectionThreshold;
  }

  if (selectionControllerR){
    console.log("Right VR Controller detected for point selection.");
    console.log(selectionControllerR);
    pointSelectionRaycasterR = new THREE.Raycaster();
    pointSelectionRaycasterR.params.Points.threshold = selectionThreshold;
    selectionControllerR.addEventListener('A touch began', function(event) {
      isRaycasterLineActive = true;
    });
    selectionControllerR.addEventListener('A touch ended', function(event) {
      isRaycasterLineActive = false;
    });
  }

    /*
    raycasterLineMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000
    });
    raycasterLineGeometry = new THREE.Geometry();
    raycasterLineGeometry.vertices.push(controller.position);
    raycasterLineGeometry.vertices.push(controller.position + (controller.rotation * 10));
    raycasterLine = new THREE.Line(raycasterLineGeometry, raycasterLineMaterial);
    scene.add(raycasterLine);
    */

  // setup mouse raycaster here

  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'click', onClick, false );
}

/**
 * Call this in GameLoop or Update to detect raycaster intersections on every
 * frame.
 */
var mousedOverPoint;
var arrow;
function pointSelectionUpdate() {
  // calculate objects intersecting the ray

  /*if (selectionControllerL){
    pointSelectionRaycasterL.set(selectionControllerL.position, selectionControllerL.rotation);
  }*/
  if (selectionControllerR) {
    var matrix = new THREE.Matrix4();
    matrix.extractRotation( selectionControllerR.matrix );

    var direction = new THREE.Vector3( 0, 0, 1 );
    direction.applyMatrix4(matrix);
    //matrix.multiplyVector3( direction );
    direction.multiplyScalar(-1);
    pointSelectionRaycasterR.set(selectionControllerR.position, direction);
    intersects = pointSelectionRaycasterR.intersectObject(pointsSystem)
  }

  // If no controllers are present, revert to mouse/camera selection.
  if (selectionControllerL == null && selectionControllerR == null) {
    pointSelectionRaycaster.setFromCamera(pointSelectionMouse, camera);
    intersects = pointSelectionRaycaster.intersectObject(pointsSystem);
  }


  if (intersects != null) {
    intersects = (intersects.length) > 0 ? intersects[0] : null;
  }

  // Reset point size when not moused over
  setPointScale(mousedOverPoint, plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ));
  //pointsGeometry.boundingBox = null;
  if (intersects != null) {
    //console.log(intersects.point.x + " " + intersects.point.y + " " + intersects.point.z);
    //console.log(intersects);
      if(pointsGeometry.getAttribute('isHidden').array[intersects.index] !== 1) {
          setPointScale(intersects.index, plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ) * 2);

      }
      mousedOverPoint = intersects.index;




  }
  else {

    setPointScale(mousedOverPoint, plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ));
  }

  // Press 'A' and 'X' is select/deselect all points.

  if (XisPressed && AisPressed){
    XisPressed = false;
    AisPressed = false;
    if (selectedPoints.length > 0){
      clearSelection();
    }
    else{
      selectAll();
    }
  }



  scene.remove ( raycasterLine );
  if (pointSelectionRaycasterR && selectionControllerR && pointSelectionRaycasterR.ray.origin) {
    var lineLength;
    if (intersects){
      lineLength = intersects.distance;
    }
    else {
      lineLength = 1000000;
    }
    if (isRaycasterLineActive) {
      raycasterLine = new THREE.ArrowHelper(pointSelectionRaycasterR.ray.direction, pointSelectionRaycasterR.ray.origin, lineLength, 0xff00ff, 0, 0);
      scene.add(raycasterLine);
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
  /*//make hidden points un-selectable
  if(pointsGeometry.getAttribute('isHidden').array[pointIndex] === true){
      return;
  }*/
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
      setPointScale(i, pointsGeometry.getAttribute('size').array[i] =
        plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ));
    }
  }
  pointsGeometry.getAttribute( 'isSelected' ).array = selected;
  selectedPoints = [];
  if (printArrayAfter){
    console.log(selectedPoints);
  }
}

/**
 * inverts the current selection. All selected points are deselected and
 * all unselected pointsare selected
 */
function invertSelection(){
  for(var i = 0; i < pointsGeometry.getAttribute('size').array.length; i++){
      selectPoint(i);
  }
}

/**
 * selects all points in the world
 */
function selectAll(){
    for(var i = 0; i < pointsGeometry.getAttribute('size').array.length; i++){
      if(!pointsGeometry.getAttribute('isSelected').array[i])
        selectPoint(i);
    }
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
    selectPoint(intersects.index);
    //hidePoint(intersects.index);
  }
  else {
    clearSelection();
    //unhideRecent();
  }
  if (selectedPoints.length > 0){
    console.log(getSelectedPointPositions());
  }
  //console.log(hiddenPoints);
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

/**
 * Gets the color of a singular datapoint.
 *
 * @param {Number} datasetIndex : index of point to get the color of
 * @returns {THREE.Color} a Vector3 of RGB values (0-1.0)
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

  // Assemble the RGB components in a color value.
  newColor.setRGB(vec3.x/largestX, vec3.y/largestY, vec3.z/largestZ);

  return newColor;
}

/**
 * Gets an array of the xyz values of all currently selected points
 *
 * @return {Vector3[]} array of Vector3 objects containing positions
 */

//must be fixed. Based on world position not value of points
function getSelectedPointPositions() {

  var selectedPointPositions = [];

  for(var i = 0; i < selectedPoints.length; i++){
    var tempX, tempY, tempZ;
    tempX = pointsGeometry.getAttribute('position').array[selectedPoints[i] * 3];
    tempY = pointsGeometry.getAttribute('position').array[selectedPoints[i] * 3 + 1];
    tempZ = pointsGeometry.getAttribute('position').array[selectedPoints[i] * 3 + 2];

    selectedPointPositions.push(new THREE.Vector3(tempX, tempY, tempZ));
  }

  return selectedPointPositions;
}


/**
 * Gets an array containing all values of the specified axis
 *
 * @param {String} axis : the axis desired. Must be x, y, or z
 * @returns {float[]} the array containing the values of the desired axis
 */
function getSelectedAxisValues(axis){

  var vals = [];
  var selectedPositions = getSelectedPointPositions();
    for( var i = 0; i < selectedPositions.length; i++) {
       if (     axis.valueOf() === 'x') {
           vals.push(selectedPositions[i].x)
       }
       else if (axis.valueOf() === 'y') {
            vals.push(selectedPositions[i].y)
       }
       else if (axis.valueOf() === 'z') {
           vals.push(selectedPositions[i].z)
        }
       else {
            console.log("Can only get values for the x, y, or z axis.");
            break;
        }

  }
    return vals;
}


/////////////////////////////////////////////////////////////////////////
///////////////////           POINT HIDING            ///////////////////
/////////////////////////////////////////////////////////////////////////


//if presses hide button away from a point, un-hides the most recently hidden point?

function hidePoint(pointIndex){

    pointsGeometry.getAttribute('isHidden').array[pointIndex] = true;
    hiddenPoints.push(pointIndex);
    //do the thing that hides it
    //hiding by changing the colour to black is a very poor solution. Ideally color would include an alpha channel.
    //setPointColor(pointIndex, new THREE.Vector3(0,0,0));
    setPointScale(pointIndex, 0);

}

function unhide(pointIndex){
    hiddenPoints.splice(hiddenPoints.indexOf(pointIndex),1);
    pointsGeometry.getAttribute('isHidden').array[pointIndex] = false;
    //undo the thing that hides it
    /*setPointColor(pointIndex, colorFromXYZcoords(new THREE.Vector3(
        pointsGeometry.getAttribute('position').array[(pointIndex*3)],
        pointsGeometry.getAttribute('position').array[(pointIndex*3)+1],
        pointsGeometry.getAttribute('position').array[(pointIndex*3)+2])));*/
    setPointScale(pointIndex, pointsGeometry.getAttribute('size').array[pointIndex] =
        plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ));
}

function unhideRecent(){
    var recentIndex = (hiddenPoints[hiddenPoints.length -1]);
    unhide(recentIndex);

}

function unhideAll(){
    for(var i = 0; i < pointsGeometry.getAttribute('size').array.length; i++){
        unhide(i);
    }
}


function invertHidden(){
  for( var i = 0; i < pointsGeometry.getAttribute('size').array.length; i++){
    if(pointsGeometry.getAttribute('isHidden').array[i] === true){
      unhide(i);
    }
    else {
      hidePoint(i);
    }
  }
    console.log(hiddenPoints);
}


function viewHidden(){
    for( var i = 0; i < pointsGeometry.getAttribute('size').array.length; i++){
        if(pointsGeometry.getAttribute('isHidden').array[i] === true || getPointColor(i) === new THREE.Color(0,0,0)){
            setPointColor(i, colorFromXYZcoords(new THREE.Vector3(
                pointsGeometry.getAttribute('position').array[(i*3)],
                pointsGeometry.getAttribute('position').array[(i*3)+1],
                pointsGeometry.getAttribute('position').array[(i*3)+2])));
        }
        else {
            setPointColor(i, new THREE.Vector3(0,0,0));
        }
    }
    console.log(hiddenPoints);
}








