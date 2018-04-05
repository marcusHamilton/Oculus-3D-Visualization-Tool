/**
 * Handles controller input for interactions in the VR space.
 */

var handControlL; // Left hand Oculus controller
var handControlR; // Right hand Oculus controller

//This is gross, We'll probably put the listeners in pointSelection instead of
//having global booleans.
var AisPressed;
var XisPressed;

var movementSpeedCoeff = 0.1;

var rotationSpeed = 0.1;
var cameraDirection = new THREE.Vector3();
var theta; // Angle between x and z
// ~~~~~~~~~~~~~~~ INITIALIZE HAND CONTROLS ~~~~~~~~~~~~~~~~~~~
/**
 * The following is an event listener for when a hand held controller is connected
 */
var meshColorOff = 0xDB3236; //  Red.
var meshColorOn = 0xF4C20D; //  Yellow.
var guiInputHelper;

var rightGrip;
var leftGrip;

//var directionalArrow = new THREE.Object3D();

/**
 * This gets called when a controller wakes up or is plugged in, providing
 * a reference to the left and right controller objects.
 */
window.addEventListener('vr controller connected', function (event) {

	console.log("Controller woken");
    controller = event.detail;
    scene.add(controller);
	
	if(scene.getObjectByName("Oculus Touch (Left)") && scene.getObjectByName("Oculus Touch (Left)") != null){
		handControlL = scene.getObjectByName("Oculus Touch (Left)");
	}
	if(scene.getObjectByName("Oculus Touch (Right)") && scene.getObjectByName("Oculus Touch (Right)") != null){
		handControlR = scene.getObjectByName("Oculus Touch (Right)");
	}
    //Ensure controllers appear at the right height
    //controller.standingMatrix = renderer.vr.getStandingMatrix();
    //controller.head = window.camera;

    //Add a visual for the controllers
    var
        controllerMaterial = new THREE.MeshStandardMaterial({
            color: meshColorOff
        }),
        controllerMesh = new THREE.Mesh(
            new THREE.ConeGeometry(0.045, 0.15, 25, 1),
            controllerMaterial
        ),
        handleMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.01, 0.01, 0.09,25),
            controllerMaterial
        );

    controllerMaterial.flatShading = true;
    controllerMesh.rotation.x = -Math.PI / 2;
    handleMesh.position.y = -0.05;
    controllerMesh.add(handleMesh);
    controller.userData.mesh = controllerMesh;//  So we can change the color later.
    controllerMesh.name = "C_Mesh";
	if (handControlL && handControlL != null) {
        handControlL.add(controllerMesh);
    }
    if (handControlR && handControlR != null) {
        handControlR.add(controllerMesh);
    }
    //Add Visual for Direction
    // var
    //     directionalArrowMaterial = new THREE.MeshStandardMaterial({
    //         color: meshColorOff
    //     }),
    //     directionalArrowMesh = new THREE.Mesh(
    //         new THREE.CylinderGeometry(0.005, 0.05, 0.1, 6),
    //         directionalArrowMaterial
    //     ),
    //     directionalArrowHandleMesh = new THREE.Mesh(
    //         new THREE.BoxGeometry(0.03, 0.1, 0.03),
    //         directionalArrowMaterial
    //     );
    //
    // directionalArrowMaterial.flatShading = true;
    // directionalArrowMesh.rotation.x = -Math.PI / 2;
    // directionalArrowHandleMesh.position.y = -0.05;
    // directionalArrowMesh.add(directionalArrowHandleMesh);
    //
    // directionalArrow.add(directionalArrowMesh);
    // //rig.add(directionalArrow);
    //
    // castShadows(directionalArrow);
    // receiveShadows(directionalArrow);

    castShadows(controller);
    receiveShadows(controller);

    //  Allow this controller to interact with DAT GUI.
    guiInputHelper = dat.GUIVR.addInputObject(handControlR);
    scene.add(guiInputHelper);

    setListeners();

    //Add selection controls
    if (handControlR && handControlR != null) {
        aRightMesh = handControlR.getChildByName("C_Mesh");
        initializeSelectionControls();
    }
    
    //Add movement controls
    initializeMovementControls();

    // temporary booleans
    AisPressed = false;
    XisPressed = false;

});

// ~~~~~~~~~~~~~~~ MOVEMENT CONTROLS ~~~~~~~~~~~~~~~~~~~

function initializeMovementControls() {
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
 function updatePointsPosition() {
	 points = collabGroup;
	
	 var quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(0,1,0), Math.PI/16 );
	 if (handControlL && handControlL != null) {
		 camDir = camera.getWorldDirection()
		 //xMovement = movementSpeedCoeff * (handControlL.getAxis(1) * camDir.x - handControlL.getAxis(0) * camDir.x);
		 //console.log("camX: " + camDir.x);
		 //console.log("moveX: " + xMovement);
		 //zMovement = movementSpeedCoeff * (handControlL.getAxis(1) * camDir.z + handControlL.getAxis(0) * camDir.z);
		 xMovement = movementSpeedCoeff * (handControlL.getAxis(1) * camDir.x + handControlL.getAxis(0) * camDir.z);
		 zMovement = movementSpeedCoeff * (-handControlL.getAxis(0) * camDir.x + handControlL.getAxis(1) * camDir.z);
		 points.translateX(xMovement);
		 points.translateZ(zMovement);
		 if(leftGrip){
			 //datasetAndAxisLabelGroup.rotation.y += 0.018; //rotation doesnt work right
		}
	 }
	 if (handControlR && handControlR != null){
		 collabGroup.translateY(handControlR.getAxis(1)*movementSpeedCoeff*0.5);
		 if(rightGrip){
			 //center.rotation.y += 0.0174533; //rotation doesn't work
		 }
	 }
 }
 
function updateMovementControls(){
    rotAngle = Math.atan2(rig.getWorldDirection.z, rig.getWorldDirection.x);
    //left controller: Horizontal movement + positive vertical movement
    if (handControlL && handControlL != null) {
		/*dir = camera.getWorldDirection;
		console.log("x: " + dir.getComponent(0))
		console.log("y: " + dir.getComponent(1))
		console.log("z: " + dir.getComponent(2))*/
		//xMovement = dir
		//dir
        //rig.translateX(handControlL.getAxis(0) * movementSpeedCoeff);
        //rig.translateZ(handControlL.getAxis(1) * movementSpeedCoeff);
		//rig.setRotationFromQuaternion(camera.getWorldQuaternion());
        if(leftGrip){
            //rig.translateY(movementSpeedCoeff*(0.5));
        }
    }
    //right Controller: Rotation + negative vertical movement
    if (handControlR) {
        //rig.rotation.y -= (0.0174533)*(handControlR.getAxis(0));
        if(rightGrip){
            //rig.translateY((-1)*movementSpeedCoeff*(0.5));
        }
    }
}

// ~~~~~~~~~~~~~~~ BUTTON PRESS EVENT LISTENERS ~~~~~~~~~~~~~~~~~~~

/**
 * Event listeners for hand control button press/touch/near-touch
 */
function setListeners() {
    //Button events. This is currently just using the primary button
    // Trigger presses print controller debug info.
    // LEFT CONTROLLER
    if (handControlL && handControlL != null) {
        handControlL.addEventListener('primary press began', function (event) {

            event.target.userData.mesh.material.color.setHex(meshColorOn);
            console.log("Left controller trigger press detected, Printing Controller Object");
        });
        handControlL.addEventListener('primary press ended', function (event) {

            event.target.userData.mesh.material.color.setHex(meshColorOff);
        });
    }
    // RIGHT CONTROLLER
    if (handControlR && handControlR != null) {
        handControlR.addEventListener('primary press began', function (event) {

            event.target.userData.mesh.material.color.setHex(meshColorOn);
            console.log("Right controller trigger press detected, Printing Controller Object");
            guiInputHelper.pressed(true);

        });
        handControlR.addEventListener('primary press ended', function (event) {

            event.target.userData.mesh.material.color.setHex(meshColorOff);
            guiInputHelper.pressed(false)
        });
    }
    //On controller removal
    // LEFT CONTROLLER
    if (handControlL && handControlL != null) {
        handControlL.addEventListener('disconnected', function (event) {

            handControlL.parent.remove(controller)
        });
    }
	
	 //'Click left thumbstick' to enter VR.
    if (handControlL && handControlL != null) {
        handControlL.addEventListener('thumbstick press began', function (event) {
            enterVR.on("enter");
        });
        handControlL.addEventListener('thumbstick press ended', function (event) {

        });
	}
    // RIGHT CONTROLLER
    if (handControlR && handControlR != null) {
        handControlR.addEventListener('disconnected', function (event) {

            handControlR.parent.remove(controller)
        });
    }
    //Press 'A' (Right Controller)(select/deselect a point)
    if (handControlR && handControlR != null) {
        handControlR.addEventListener('A press began', function (event) {
            AisPressed = true;
            //console.log("A Pressed");
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
    if (handControlR && handControlR != null) {
        handControlR.addEventListener('B press began', function (event) {
            if (intersects) {
                hidePoint(intersects.index);
            }
            else {
                unhideRecent();
            }
        });
        handControlR.addEventListener('B press ended', function (event) {

        });
    }
    //Press "grip" (Right Controller) to move in positive vertical direction
    if (handControlR && handControlR != null) {
        handControlR.addEventListener('grip press began', function (event) {
            rightGrip = true;
			
			if(VRGui && statsLabelGroup){
				VRGui.visible = !VRGui.visible;
				statsLabelGroup.visible = !statsLabelGroup.visible;
				
			}
        });
        handControlR.addEventListener('grip press ended', function (event) {
            rightGrip = false;
        });
    }
    //Press "grip" (left controller) to move in negative vertical direction
    if (handControlL && handControlL != null) {
        handControlL.addEventListener('grip press began', function (event) {
            leftGrip = true;
        });
        handControlL.addEventListener('grip press ended', function (event) {
            leftGrip = false;
        });
    }
    //Press 'A' (Right Controller) and 'X' (Left Controller) to select/deselect all
    if (handControlL && handControlL != null) {
        handControlL.addEventListener('X press began', function (event) {
            XisPressed = true;
        });
        handControlL.addEventListener('X press ended', function (event) {
            XisPressed = false;
        });
    }
    //Hold 'B' and 'Y' hide/unhide all
    if (handControlL && handControlL != null) {
        handControlL.addEventListener('Y press began', function (event) {

        });
        handControlL.addEventListener('Y press ended', function (event) {

        });
    }
    //'Click right thumbstick' to invert selection.
    if (handControlR && handControlR != null) {
        handControlR.addEventListener('thumbstick press began', function (event) {
            invertSelection();
        });
        handControlR.addEventListener('thumbstick press ended', function (event) {

        });
    }
    //Touch right thumbstick to show directional arrow
    if (handControlR && handControlR != null){
        handControlR.addEventListener('thumbstick touch began', function(event) {
            //rig.add(directionalArrow);
        });
        handControlR.addEventListener('thumbstick touch ended', function(event) {
            //rig.remove(directionalArrow);
        });
    }
}

// ~~~~~~~~~~~~~~~ KEYBOARD CONTROLS ~~~~~~~~~~~~~~~~~~~

  function onAKeyPress(event) {
      var keyCode = event.which;
      var translationSpeed = 0.1;

      var inverseTheta
      var gamma // Angle between x and y
      //A == 65 Left
      if (keyCode == 65) {
          camera.position.z -= translationSpeed;
      }
      //D == 68 Right
      else if (keyCode == 68) {
          camera.position.z += translationSpeed;
      }
      //W == 87 Forward
      else if (keyCode == 87) {
          camera.getWorldDirection(cameraDirection);
          theta = Math.atan2(cameraDirection.x, cameraDirection.z);
          camera.position.x += (translationSpeed * Math.sin(theta));
          camera.position.z += (translationSpeed * Math.cos(theta));
      }
      //S == 83 Backward
      else if (keyCode == 83) {
          camera.getWorldDirection(cameraDirection);
          theta = Math.atan2(cameraDirection.x, cameraDirection.z);
          camera.position.x -= (translationSpeed * Math.sin(theta));
          camera.position.z -= (translationSpeed * Math.cos(theta));
      }
      //space == 32 Up
      else if (keyCode == 32) {
          camera.position.y += translationSpeed;
      }
      //ctrl == 17  Down
      else if (keyCode == 17) {
          camera.position.y -= translationSpeed;
      }
      //Q == 81 Look left
      else if (keyCode == 81) {
          camera.rotation.y += rotationSpeed;
      }
      //E == 69 Look right
      else if (keyCode == 69) {
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