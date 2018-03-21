/**
 * Handles controller input for movement in the VR space.
 */

var movementControllerL; //Object representing the left Oculus controlls.
var movementControllerR; //Object representing the right Oculus controlls.
var movementSpeedCoeff = 0.3;

/**
 * This gets called when a controller wakes up or is plugged in, providing
 * a reference to the left and right controller objects.
 */
function initializeMovementControls(){
  movementControllerL = scene.getObjectByName("Oculus Touch (Left)");
  movementControllerR = scene.getObjectByName("Oculus Touch (Right)");
  // Example event listener for button press/touch/near-touch
  // Look at VRController.js:956 for how to define other events
  // by passing strings to .addEventListener()
  if (movementControllerL) {
    movementControllerL.addEventListener('X press began', function (event) {
      console.log("X Button Pressed!");
      // Function calls go here...
    });
  }
}

/**
 * This gets called in the main update() loop.
 */
function updateMovementControls(){
  // Check that the left controller is initialized
  if (movementControllerL){
    // Check that the dataset has been drawn
    if (datasetAndAxisLabelGroup){
      // TODO: Left hand controls go here:
      // Just a quick test
      datasetAndAxisLabelGroup.position.x += movementControllerL.getAxis(0) * movementSpeedCoeff * -1;
      datasetAndAxisLabelGroup.position.z += movementControllerL.getAxis(1) * movementSpeedCoeff * -1;
    }
  }

  // Check that the right controller is initialized
  if (movementControllerR){
    if (datasetAndAxisLabelGroup) {
      // TODO: Right hand controls go here:
    }
  }
}

