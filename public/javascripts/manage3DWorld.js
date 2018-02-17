/*
  This js file is responsible for building the 3D world
*/

//Set up essential global elements
var scene; //The scene to which all elements are added to
var camera; //The main perspective camera
var renderer; //The renderer for the project
var vrControls; //Vr Controls
var trackballControls; //First person controls
var effect; //The variable responsible for holding the vreffect
var vrButton; //Enter vr button seen at start
var enterVR; //Holds info of whether or not the user is in VR
var animationDisplay = window; //Holds the HMD (By default is window)
var delta;
var torus;
var lastRender = 0; //Keeps track of last render to avoid obselete rendering
var windowWidth = window.innerWidth; //The width of the browser window
var windowHeight = window.innerHeight; //The height of the browser window
var parsedData; //Parsed data obtained from handleCSVupload
//The following are to be accessed like so: parsedData[i][x_AxisIndex]
//parsedData[i][x_AxisIndex]
//parsedData[i][y_AxisIndex]
//parsedData[i][z_AxisIndex]
var x_AxisIndex; //The x-axis index of which to use for scatter plot positioning
var y_AxisIndex; //The y-axis of which to use for scatter plot positioning
var z_AxisIndex; //The z-axis of which to use for scatter plot positioning

//Global constants for config (Move these to a json config file or something)

var plotInitSizeX = 10;
var plotInitSizeY = 5;
var plotInitSizeZ = 10;
var plotPointSizeCoeff = 0.01;

//Called every frame
function update(timestamp) {
  //Calculate delta to allow smoother object movement
  if (timestamp == null) {
    //Fixes small lag at begining of program where
    //timestamp is null
    timestamp = 15;
  }
  delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  torus.rotation.y += 0.002
  if (torus.rotation.y > Math.PI) torus.rotation.y -= (Math.PI * 2) //  Keep DAT GUI display tidy!

  //Add all updates below here

  //Ensure that we are looking for controller input
  trackballControls.update();
  THREE.VRController.update();

}

//Draw game objects to the scene
function render(timestamp) {

  if (enterVR.isPresenting()) {
    vrControls.update();
    renderer.render(scene, camera);
    effect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }
}

/*
Manages program logic. Update, Render, Repeat
DO NOT add anything to this.
*/
var testColor;
var testInc = 0;
var GameLoop = function(timestamp) {
  update(timestamp);
  render(timestamp);

  pointSelectionUpdate();

  // set BufferGeometry (in drawDataset.js) attributes to be updatable.
  // (This must be set every time you want the buffergeometry to change.
  pointsGeometry.getAttribute('customColor').needsUpdate = true;
  pointsGeometry.getAttribute('position').needsUpdate = true;
  pointsGeometry.getAttribute('size').needsUpdate = true;

  //Allows this to be called every frame
  animationDisplay.requestAnimationFrame(GameLoop);
};

/*
This function is responsible for building the world and creates the
data points passed from the csv
Acts as the main function. From here everything else is called.
*/
function build3DSpace() {
  //Recover the CSVData from the browsers webStorage
  retrieveCSVData();
  //Initialize camera, scene, and renderer
  firstRender = true;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.vr.enabled = true;
  renderer.vr.standing = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);
  //Add the renderer to the html page
  document.body.appendChild(renderer.domElement);
  //Add light and floor
  var light = new THREE.DirectionalLight(0xFFFFFF, 1, 100)
  light.position.set(1, 10, -0.5)
  light.castShadow = true
  light.shadow.mapSize.width = 2048
  light.shadow.mapSize.height = 2048
  light.shadow.camera.near = 1
  light.shadow.camera.far = 12
  scene.add(light)

  scene.add(new THREE.HemisphereLight(0x909090, 0x404040))


  var floor = new THREE.Mesh(

    new THREE.PlaneBufferGeometry(6, 6, 12, 12),
    new THREE.MeshStandardMaterial({

      roughness: 1.0,
      metalness: 0.0,
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.8
    })
  )
  floor.rotation.x = Math.PI / -2
  floor.receiveShadow = true
  scene.add(floor)
  // Handle canvas resizing
  window.addEventListener('resize', onResize, true);
  window.addEventListener('vrdisplaypresentchange', onResize, true);
  setUpControls();
  addEnterVrButtons();
  //Get HMD type
  enterVR.getVRDisplay()
    .then(function(display) {
      renderer.vr.setDevice(display);
      animationDisplay = display;
      setStageDimensions(display.stageParameters);
      camera.position.set(plotInitSizeX / 2.0, camera.position.y, plotInitSizeZ * 1.5);
    })
    .catch(function() {
      // If there is no display available, fallback to window
      animationDisplay = window;
    });

  //Center the camera on the data and back so that you are not inside the first
  // cube
  camera.position.set(plotInitSizeX / 2.0, camera.position.y, plotInitSizeZ * 1.5);
  //This can be removed after development if desired
  drawFPSstats();


  drawDataset(x_AxisIndex, y_AxisIndex, z_AxisIndex);
  initializeSelectionControls()

  //GameLoop must be called last after everything to ensure that
  //everything is rendered
  GameLoop();
}

/*
This draws the fps and various stats to the page.
Click on the widget to see other stats.
Can be removed after development.
*/
function drawFPSstats() {
  (function() {
    var script = document.createElement('script');
    script.onload = function() {
      var stats = new Stats();
      document.body.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        requestAnimationFrame(loop)
      });
    };
    script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
    document.head.appendChild(script);
  })()
}


/*
Listens and adapts the aspect ratio and size of the canvas
This allows the scene to hold its shape when the browser is
resized.
*/
function onResize(e) {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  effect.setSize(windowHeight, windowWidth);
  renderer.setSize(windowWidth, windowHeight);
  camera.aspect = windowWidth / windowHeight;
  camera.updateProjectionMatrix();
}

/*
Grabs the data that is sent from the csv file over browser sessionStorage
@Pre:
    Key 'parsedCSVData' exists in sessionStorage
    Key 'initialAxisValues' exists in initialAxisValues
@post:
    parsedData contains the content that was stored in json
    x_AxisIndex contains the users inputted x axis
    y_AxisIndex contains the users inputted y axis
    z_AxisIndex contains the users inputted z axis
*/
function retrieveCSVData() {
  var retrievedObject = sessionStorage.getItem('parsedCSVData');
  parsedData = JSON.parse(retrievedObject);

  //get dropdown options
  var retrievedOptions = sessionStorage.getItem('initialAxisValues');
  retrievedOptions = JSON.parse(retrievedOptions);
  x_AxisIndex = retrievedOptions[0];
  y_AxisIndex = retrievedOptions[1];
  z_AxisIndex = retrievedOptions[2];
}

/*
Determines whether or not a VR headset is available.
If not it allows the user to try without a headset as well
as offers a link to the webvr page to learn more.
On clicking enter vr the scene is loaded appropriately for the
headset.
*/
function addEnterVrButtons() {
  // Create WebVR UI Enter VR Button
  var options = {
    color: 'white',
    background: false,
    corners: 'square'
  };
  enterVR = new webvrui.EnterVRButton(renderer.domElement, options)
    .on("enter", function() {
      console.log("enter VR")
    })
    .on("exit", function() {
      console.log("exit VR");
      camera.quaternion.set(0, 0, 0, 1);
    })
    .on("error", function(error) {
      document.getElementById("learn-more").style.display = "inline";
      console.error(error)
    })
    .on("hide", function() {
      document.getElementById("ui").style.display = "none";
      // On iOS there is no button to close fullscreen mode, so we need to provide one
      if (enterVR.state == webvrui.State.PRESENTING_FULLSCREEN) document.getElementById("exit").style.display = "initial";
    })
    .on("show", function() {
      document.getElementById("ui").style.display = "inherit";
      document.getElementById("exit").style.display = "none";
    });
  // Add button to the #button element
  document.getElementById("vr-button").appendChild(enterVR.domElement);

}

/*
These are the head controls as well as the ability to move around in 2d space. They do not correspond to the hand controls.
*/
function setUpControls() {
  //Initialize vrcontrols and match camera height to the user.
  vrControls = new THREE.VRControls(camera);
  vrControls.standing = true;
  camera.position.y = vrControls.userHeight;

  //Add fps controls as well
  trackballControls = new THREE.TrackballControls(camera);
  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 10;
  trackballControls.panSpeed = 10;
  trackballControls.noZoom = false;
  trackballControls.noPan = false;
  trackballControls.staticMoving = true;
  trackballControls.dynamicDampingFactor = 0.3;
  trackballControls.keys = [65, 83, 68];

  //Apply VR stereo rendering to renderer.
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

  //Set up controls gui


  applyDown = function(obj, key, value) {

    obj[key] = value
    if (obj.children !== undefined && obj.children.length > 0) {

      obj.children.forEach(function(child) {

        applyDown(child, key, value)
      })
    }
  }
  castShadows = function(obj) {

    applyDown(obj, 'castShadow', true)
  }
  receiveShadows = function(obj) {

    applyDown(obj, 'receiveShadow', true)
  }

  //Arbitrary shape for testing gui settings
  torus = new THREE.Mesh(

    new THREE.TorusKnotGeometry(0.4, 0.15, 256, 32),
    new THREE.MeshStandardMaterial({
      roughness: 0.01,
      metalness: 0.2
    })
  )
  torus.position.set(-0.25, 1.4, -1.5)
  torus.castShadow = true
  torus.receiveShadow = true
  scene.add(torus)


  //  DAT GUI for WebVR settings.
  //  https://github.com/dataarts/dat.guiVR

  dat.GUIVR.enableMouse(camera)
  var gui = dat.GUIVR.create('Settings')
  gui.position.set(0.2, 0.8, -1)
  gui.rotation.set(Math.PI / -6, 0, 0)
  scene.add(gui)
  gui.add(torus.position, 'x', -1, 1).step(0.001).name('Position X')
  gui.add(torus.position, 'y', -1, 2).step(0.001).name('Position Y')
  gui.add(torus.rotation, 'y', -Math.PI, Math.PI).step(0.001).name('Rotation').listen()
  castShadows(gui)

}

/*
The following is an event listener for when a hand held controller is connected
*/

var controller;
window.addEventListener('vr controller connected', function(event) {

  controller = event.detail
  scene.add(controller)

  //Ensure controllers appear at the right height
  //controller.standingMatrix = renderer.vr.getStandingMatrix()

  controller.head = window.camera

  //Add a visual for the controllers
  var
    meshColorOff = 0xDB3236, //  Red.
    meshColorOn = 0xF4C20D, //  Yellow.
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
    )

  controllerMaterial.flatShading = true
  controllerMesh.rotation.x = -Math.PI / 2
  handleMesh.position.y = -0.05
  controllerMesh.add(handleMesh)
  controller.userData.mesh = controllerMesh //  So we can change the color later.
  controller.add(controllerMesh)
  castShadows(controller)
  receiveShadows(controller)


  //  Allow this controller to interact with DAT GUI.

  var guiInputHelper = dat.GUIVR.addInputObject(controller)
  scene.add(guiInputHelper)

  //Button events. This is currently just using the primary button
  controller.addEventListener('primary press began', function(event) {

    event.target.userData.mesh.material.color.setHex(meshColorOn)
    guiInputHelper.pressed(true)
  })
  controller.addEventListener('primary press ended', function(event) {

    event.target.userData.mesh.material.color.setHex(meshColorOff)
    guiInputHelper.pressed(false)
  })

  //On controller removal
  controller.addEventListener('disconnected', function(event) {

    controller.parent.remove(controller)
  })
})
