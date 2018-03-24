/**
 * Handles controller input for interactions in the VR space.
 */

var handControlL; // Left hand Oculus controller
var handControlR; // Right hand Oculus controller

//This is gross, We'll probably put the listeners in pointSelection instead of
//having global booleans.
var AisPressed;
var XisPressed;

// ~~~~~~~~~~~~~~~ INITIALIZE HAND CONTROLS ~~~~~~~~~~~~~~~~~~~
/**
 * The following is an event listener for when a hand held controller is connected
 */
var meshColorOff = 0xDB3236; //  Red.
var meshColorOn = 0xF4C20D; //  Yellow.
var guiInputHelper
window.addEventListener('vr controller connected', function(event) {

  controller = event.detail;
  scene.add(controller);

  handControlL = scene.getObjectByName("Oculus Touch (Left)");
  handControlR = scene.getObjectByName("Oculus Touch (Right)");
  console.log("Attaching left controller to rig");
  rig.add(handControlL);
  console.log("Attaching right controller to rig");
  rig.add(handControlR);
  // if (handControlL != null){
  //   console.log("Left hand controller attached to rig");
  //   rig.add(handControlL);
  //}
  // if (handControlR != null){
  //   console.log("Right hand controller attached to rig");
  //   rig.add(handControlR);
  // }

  //Ensure controllers appear at the right height
  //controller.standingMatrix = renderer.vr.getStandingMatrix();
  controller.head = window.camera;

  //Add a visual for the controllers
  var

    controllerMaterial = new THREE.MeshStandardMaterial({
      color: meshColorOff
    }),
    controllerMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.05, 0.1, 6),
      controllerMaterial
    ),
    handleMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.1, 0.03),
      controllerMaterial
    );

  controllerMaterial.flatShading = true;
  controllerMesh.rotation.x = -Math.PI / 2;
  handleMesh.position.y = -0.05;
  controllerMesh.add(handleMesh);
  controller.userData.mesh = controllerMesh;//  So we can change the color later.
  controller.add(controllerMesh);
  castShadows(controller);
  receiveShadows(controller);

  //  Allow this controller to interact with DAT GUI.
  guiInputHelper = dat.GUIVR.addInputObject(controller);
  scene.add(guiInputHelper);

  setListeners();

  //Add selection controls
  initializeSelectionControls();
  //Add movement controls
  initializeMovementControls();

  // temporary booleans
  AisPressed = false;
  XisPressed = false;

});

// ~~~~~~~~~~~~~~~ MOVEMENT CONTROLS ~~~~~~~~~~~~~~~~~~~
/**
 * This gets called when a controller wakes up or is plugged in, providing
 * a reference to the left and right controller objects.
 */


var movementSpeedCoeff = 0.3;
function initializeMovementControls(){
  // Example event listener for button press/touch/near-touch
  // Look at VRController.js:956 for how to define other events
  // by passing strings to .addEventListener()
  /*
  if (handControlL) {
    handControlL.addEventListener('X press began', function (event) {
      //console.log("X Button Pressed!");
      // Function calls go here...
    });
  }
  if (handControlL) {
    handControlL.addEventListener('A press began', function (event) {
      //console.log("A Button Pressed!");
      // Function calls go here...
    });
  }
  */
}

/**
 * This gets called in the main update() loop.
 */
function updateMovementControls(){
  // Check that the left controller is initialize
  if (handControlL){
    //console.log("Left controler ACTIVATE!!!!!!!!!!!!!");
    // Just a quick test
    //datasetAndAxisLabelGroup.position.x += handControlL.getAxis(0) * movementSpeedCoeff * -1;
    //datasetAndAxisLabelGroup.position.z += handControlL.getAxis(1) * movementSpeedCoeff * -1;
    rig.position.x  += handControlL.getAxis(0) * movementSpeedCoeff;
    rig.position.z += handControlL.getAxis(1) * movementSpeedCoeff;
    }
  }

  // Check that the right controller is initialized
  if (handControlR){
      // TODO: Right hand controls go here
        //rig.position.x  += handControlR.getAxis(0) * movementSpeedCoeff * -1;
  }


// ~~~~~~~~~~~~~~~ BUTTON PRESS EVENT LISTENERS ~~~~~~~~~~~~~~~~~~~

/**
 * Event listeners for hand control button press/touch/near-touch
 */
function setListeners(){
  //Button events. This is currently just using the primary button
  // Trigger presses print controller debug info.
  // LEFT CONTROLLER
  if (handControlL) {
    handControlL.addEventListener('primary press began', function (event) {

      event.target.userData.mesh.material.color.setHex(meshColorOn);
      console.log("Left controller trigger press detected, Printing Controller Object");
      guiInputHelper.pressed(true)
    });
    handControlL.addEventListener('primary press ended', function (event) {

      event.target.userData.mesh.material.color.setHex(meshColorOff);
      guiInputHelper.pressed(false)
    });
  }
  // RIGHT CONTROLLER
  if (handControlR) {
    handControlR.addEventListener('primary press began', function (event) {

      event.target.userData.mesh.material.color.setHex(meshColorOn);
      console.log("Right controller trigger press detected, Printing Controller Object");
      guiInputHelper.pressed(true)
    });
    handControlR.addEventListener('primary press ended', function (event) {

      event.target.userData.mesh.material.color.setHex(meshColorOff);
      guiInputHelper.pressed(false)
    });
  }
  //On controller removal
  // LEFT CONTROLLER
  if (handControlL) {
    handControlL.addEventListener('disconnected', function (event) {

      handControlL.parent.remove(controller)
    });
  }
  // RIGHT CONTROLLER
  if (handControlR) {
    handControlR.addEventListener('disconnected', function (event) {

      handControlR.parent.remove(controller)
    });
  }
  //Press 'A' (Right Controller)(select/deselect a point)
  if (handControlR) {
    handControlR.addEventListener('A press began', function (event) {
      AisPressed = true;
      if (intersects) {
        selectPoint(intersects.index);
      }
      if (selectedPoints.length > 0) {
        console.log(getSelectedPointPositions());
      }
    });
    handControlR.addEventListener('A press ended', function (event) {
      AisPressed = false;
    });
  }
  //Press 'B' (Right Controller) to hide a point
  if (handControlR) {
    handControlR.addEventListener('B press began', function (event) {
      if (intersects) {
        hidePoint(intersects.index);
      }
      else{
        unhideRecent();
      }
    });
    handControlR.addEventListener('B press ended', function (event) {

    });
  }
  //Press 'A' (Right Controller) and 'X' (Left Controller) to select/deselect all
  if (handControlL) {
    handControlL.addEventListener('X press began', function (event) {
      XisPressed = true;
    });
    handControlL.addEventListener('X press ended', function (event) {
      XisPressed = false;
    });
  }
  //Hold 'B' and 'Y' hide/unhide all
  if (handControlL) {
    handControlL.addEventListener('Y press began', function (event) {

    });
    handControlL.addEventListener('Y press ended', function (event) {

    });
  }
  //'Click right thumbstick' to invert selection.
  if (handControlR) {
    handControlR.addEventListener('thumbstick press began', function (event) {
      invertSelection();
    });
    handControlR.addEventListener('thumbstick press ended', function (event) {

    });
  }
}


// ~~~~~~~~~~~~~~~ KEYBOARD CONTROLS ~~~~~~~~~~~~~~~~~~~

function onAKeyPress(event){
  var keyCode = event.which;
  var translationSpeed = 0.1;
  var rotationSpeed = 0.1;
  var cameraDirection = new THREE.Vector3();
  var theta // Angle between x and z
  var inverseTheta
  var gamma // Angle between x and y
  //A == 65 Left
  if(keyCode == 65){
    camera.position.z -= translationSpeed;
  }
  //D == 68 Right
  else if (keyCode == 68){
    camera.position.z += translationSpeed;
  }
  //W == 87 Forward
  else if (keyCode == 87){
    camera.getWorldDirection(cameraDirection);
    theta = Math.atan2(cameraDirection.x, cameraDirection.z);
    camera.position.x += (translationSpeed*Math.sin(theta));
    camera.position.z += (translationSpeed*Math.cos(theta));
  }
  //S == 83 Backward
  else if(keyCode == 83){
    camera.getWorldDirection(cameraDirection);
    theta = Math.atan2(cameraDirection.x, cameraDirection.z);
    camera.position.x -= (translationSpeed*Math.sin(theta));
    camera.position.z -= (translationSpeed*Math.cos(theta));
  }
  //space == 32 Up
  else if(keyCode == 32){
    camera.position.y += translationSpeed;
  }
  //ctrl == 17  Down
  else if(keyCode == 17){
    camera.position.y -= translationSpeed;
  }
  //Q == 81 Look left
  else if(keyCode == 81){
    camera.rotation.y += rotationSpeed;
  }
  //E == 69 Look right
  else if(keyCode == 69){
    camera.rotation.y -= rotationSpeed;
  }
  //Look up and look down might be unnecasary when this is converted to occulus controller
  //Doesnt work anyway tho

  //R == 82 Look Up
  //else if(keyCode == 82){
  //theta = Math.atan2(cameraDirection.x, cameraDirection.z);
  //inverseTheta = Math.PI /2 - theta;
  //gamma = Math.PI - (inverseTheta + Math.PI /2);
  //camera.rotation.z += (rotationSpeed*Math.sin(gamma));
  //camera.rotation.x += (rotationSpeed*Math.cos(gamma));
  //camera.rotation.x += rotationSpeed;
  // }
}