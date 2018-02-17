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
  pointSelectionRaycaster.setFromCamera(pointSelectionMouse, camera);

  // calculate objects intersecting the ray
  var intersects = pointSelectionRaycaster.intersectObject( pointsSystem );
  intersects = ( intersects.length ) > 0 ? intersects[ 0 ] : null;
  if (intersects != null)
  {
    console.log(intersects.point.x + " " + intersects.point.y + " " + intersects.point.z);
    for (var i = 0; i < pointsGeometry.getAttribute('position').array.length; i++)
    {
      if (Math.abs(pointsGeometry.getAttribute('position').array[i].x - intersects.point.x) < 1
        && Math.abs(pointsGeometry.getAttribute('position').array[i].y - intersects.point.y) < 1
        && Math.abs(pointsGeometry.getAttribute('position').array[i].z - intersects.point.z) < 1)
      {
        setPointColor(i, new THREE.Color(1, 1, 1));
      }
    }
  }
}

function selectPoint(pointIndex)
{
  //selectedPoints.push(pointsIndex);
}

function deselectPoint()
{

}

function clearSelection()
{

}

function onMouseMove( event ) {

  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  event.preventDefault();

  pointSelectionMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointSelectionMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}