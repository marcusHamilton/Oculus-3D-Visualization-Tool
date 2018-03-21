var movementControllerL; //Object representing the left Oculus controlls.
var movementControllerR; //Object representing the right Oculus controlls.
var movementSpeedCoeff = 0.01;


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
      datasetAndAxisLabelGroup.position.x += movementControllerL.getAxis(0) * movementSpeedCoeff;
      datasetAndAxisLabelGroup.position.z += movementControllerL.getAxis(1) * movementSpeedCoeff;
    }
  }
  if (movementControllerR){

  }
}