/*
  This js file is responsible for building the 3D world
*/

//Set up essential global elements
var scene; //The scene to which all elements are added to
var camera; //The main perspective camera
var renderer; //The renderer for the project
var vrControls; //Vr Controls
var fpVrControls; //First person controls
var effect; //The variable responsible for holding the vreffect
var vrButton; //Enter vr button seen at start
var enterVR; //Holds info of whether or not the user is in VR
var animationDisplay = window; //Holds the HMD (By default is window)
var lastRender = 0; //Keeps track of last render to avoid obselete rendering
var windowWidth = window.innerWidth; //The width of the browser window
var windowHeight = window.innerHeight; //The height of the browser window
var listOfCubes = new LinkedList(); //Stores the objects in the world
var parsedData; //Parsed data obtained from handleCSVupload

//Global constants for config (Move these to a json config file or something)

var plotInitSizeX = 10;
var plotInitSizeY = 5;
var plotInitSizeZ = 10;

//Called every frame
function update(timestamp) {
  //Calculate delta to allow smoother object movement
  if(timestamp == null)
  {
    //Fixes small lag at begining of program where
    //timestamp is null
    timestamp = 15;
  }
  var delta = Math.min(timestamp - lastRender, 500);
  lastRender = timestamp;

  //Add all updates below here

  for (var i = 0; i < listOfCubes.size(); i++) {
    listOfCubes.elementAt(i).rotation.x += delta * 0.0003;
    listOfCubes.elementAt(i).rotation.y += delta * 0.0005;
  }
}

//Draw game objects to the scene
function render(timestamp) {

  if (enterVR.isPresenting()) {
    vrControls.update();
    fpVrControls.update(timestamp);
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
var GameLoop = function(timestamp) {
  update(timestamp);
  render(timestamp);
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
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //Add the renderer to the html page
  document.body.appendChild(renderer.domElement);
  // Handle canvas resizing
  window.addEventListener('resize', onResize, true);
  window.addEventListener('vrdisplaypresentchange', onResize, true);
  setUpControls();
  addEnterVrButtons();
  //Get HMD type
  enterVR.getVRDisplay()
    .then(function(display) {
      animationDisplay = display;
      setStageDimensions(display.stageParameters);
    })
    .catch(function() {
      // If there is no display available, fallback to window
      animationDisplay = window;
    });

  /*
  //Create a shape
  var boxGeometry;
  var material;
  var cube;
  for (var i = 0; i < parsedData.length; i++) {
    boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true
    });
    cube = new THREE.Mesh(boxGeometry, material);
    cube.position.set(i * -2, vrControls.userHeight, i * -2);
    scene.add(cube);
    listOfCubes.add(cube);
  }
  */
  //Move camera back so that you are not inside the first cube
  camera.position.z = 3;
  //This can be removed after development if desired
  drawFPSstats();

  drawDataset(0, 1, 2);

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

function retrieveCSVData() {
  var retrievedObject = sessionStorage.getItem('parsedCSVData');
  parsedData = JSON.parse(retrievedObject);
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
      camera.position.set(0, vrControls.userHeight, 3);
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

function setUpControls() {
  //Initialize vrcontrols and match camera height to the user.
  vrControls = new THREE.VRControls(camera);
  vrControls.standing = true;
  camera.position.y = vrControls.userHeight;

  //Add fps controls as well
  fpVrControls = new THREE.FirstPersonVRControls(camera, scene);
  fpVrControls.virticalMovement = true;

  //Apply VR stereo rendering to renderer.
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

}
