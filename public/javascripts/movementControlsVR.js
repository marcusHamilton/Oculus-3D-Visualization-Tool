var movementControllerL; //Object representing the left Oculus controlls.
var movementControllerR; //Object representing the right Oculus controlls.
var movementHMD;
var movementSpeedCoeff = 0.3;


function initializeMovementControls(){
  movementControllerL = scene.getObjectByName("Oculus Touch (Left)");
  movementControllerR = scene.getObjectByName("Oculus Touch (Right)");
}


/*
  if (datasetAndAxisLabelGroup && controllerL) {
    datasetAndAxisLabelGroup.position.x += 0.001;//(controllerL_Stick_XAxis * 0.00001);
    datasetAndAxisLabelGroup.position.z += 0.001;//(controllerL_Stick_YAxis * 0.00001);
  }
  */
function updateMovementControls(){
  if (movementControllerL){
    if (datasetAndAxisLabelGroup){
      //console.log(camera.rotation);
      datasetAndAxisLabelGroup.position.x += movementControllerL.getAxis(0) * movementSpeedCoeff * -1;
      datasetAndAxisLabelGroup.position.z += movementControllerL.getAxis(1) * movementSpeedCoeff * -1;
    }
  }
  if (movementControllerR){
    if (datasetAndAxisLabelGroup) {
      //datasetAndAxisLabelGroup.rotateY(movementControllerR.getAxis(0) * movementSpeedCoeff * -1);

      rotateAboutPoint(datasetAndAxisLabelGroup, new THREE.Vector3(5,0,5), new THREE.Vector3(0,1,0), movementControllerR.getAxis(0) * movementSpeedCoeff * -1, false);
    }
  }
}

// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
// pointIsWorld - boolean indicating the point is in world coordinates (default = false)
function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
  pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

  if(pointIsWorld){
    obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if(pointIsWorld){
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}