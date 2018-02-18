/**
 * Contains everything to do with selecting and manipulating the vertices
 * in the 3D dataset visualization.
 *
 * This is very much a work in progress and doesn't work in any usable way
 * yet.
 **/

var selectedPoints = [];  //array containing the indices of every currently
                          //selected point.
var pointSelectionRaycaster = new THREE.Raycaster();
var pointSelectionMouse = new THREE.Vector2();

function initializeSelectionControls()
{
  if (controller != null)
  {
    // Attach raycaster to VRcontroller
  }
  // setup mouse raycaster
  document.addEventListener( 'mousemove', onMouseMove, false );
  //document.addEventListener( 'click', setClicked, false );
}


function pointSelectionUpdate()
{
  /*
  pointSelectionRaycaster.setFromCamera(pointSelectionMouse, camera);

  // calculate objects intersecting the ray
  var intersects = pointSelectionRaycaster.intersectObject( pointsSystem );
  intersects = ( intersects.length ) > 0 ? intersects[ 0 ] : null;
  if (intersects != null)
  {
    console.log(intersects.point.x + " " + intersects.point.y + " " + intersects.point.z);
    for (var i = 0; i < pointsGeometry.getAttribute('position').array.length; i++)
    {
      if (Math.abs(pointsGeometry.getAttribute('position').array[i].x - intersects.point.x) < 0.1
        && Math.abs(pointsGeometry.getAttribute('position').array[i].y - intersects.point.y) < 0.1
        && Math.abs(pointsGeometry.getAttribute('position').array[i].z - intersects.point.z) < 0.1)
      {
        // Just change the point color to white when intersected for now.
        setPointColor(i, new THREE.Color(1, 1, 1));
      }
    }
  }
  */
}

function selectPoint(pointIndex)
{
  selectedPoints.push(pointsIndex);
}

function deselectPoint()
{

}

function clearSelection()
{
  selectedPoints.clear();
}

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  event.preventDefault();

  pointSelectionMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointSelectionMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
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