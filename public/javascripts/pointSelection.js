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
pointSelectionRaycaster.setFromCamera(pointSelectionMouse, camera);

var selectionThreshold = 1; //the distance the mouse has to be from a point
                            //in order for it to register as selectable
var intersects;


function initializeSelectionControls()
{
  if (controller != null)
  {
    // Attach raycaster to VRcontroller
  }
  // setup mouse raycaster
  document.addEventListener( 'mousemove', onMouseMove, false );
  document.addEventListener( 'click', onClick, false );
}


function pointSelectionUpdate()
{

  // calculate objects intersecting the ray
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

function selectPoint(pointIndex)
{
  pointsGeometry.getAttribute( 'isSelected' ).array[pointIndex] =
      !pointsGeometry.getAttribute( 'isSelected' ).array[pointIndex];
  if(pointsGeometry.getAttribute( 'isSelected' ).array[pointIndex] == false){
      selectedPoints.splice(selectedPoints.indexOf(pointIndex));
  }
  else{
      selectedPoints.push(pointIndex);
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
          setPointColor(i, new THREE.Color(1, 1, 1));
          setPointSize(i, pointsGeometry.getAttribute('size').array[i] =
                          pointsGeometry.getAttribute('size').array[i] * 1.5);
          selectPoint(i);
      }
  }
}