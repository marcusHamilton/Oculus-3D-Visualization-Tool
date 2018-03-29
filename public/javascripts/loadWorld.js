/**
 * Contains all major functions called on the VRWorld.ejs page for loading an
 * existing world from the database and drawing the data visualization.
 */

var scene; //The scene to which all elements are added to
var camera; //The main perspective camera
var renderer; //The renderer for the project
var vrControls; //Vr Controls
var trackballControls; //First person controls
var effect; //The variable responsible for holding the vreffect
var vrButton; //Enter vr button seen at start
var enterVR; //Holds info of whether or not the user is in VR
var animationDisplay = window; //Holds the HMD (By default is window)
var lastRender = 0; //Keeps track of last render to avoid obselete rendering
var windowWidth = window.innerWidth; //The width of the browser window
var windowHeight = window.innerHeight; //The height of the browser window
var controller; //VR Controller object

var pointsSystem; //THREE.js Points system for shader based visualization
var pointsGeometry; //THREE.js BufferGeometry contains vertices for datapoints
var loadedDataset; //Parsed dataset array
var plotInitSizeX = 10; //Initial X dimension of dataset visualization
var plotInitSizeY = 5; //Initial Y dimension of dataset visualization
var plotInitSizeZ = 10; //Initial Z dimension of dataset visualization
var pointVars={plotPointSizeCoeff:0.005}; //Default datapoint size
var largestX = 0; //Largest X value in the dataset for selected columns
var largestY = 0; //Largest Y value in the dataset for selected columns
var largestZ = 0; //Largest Z value in the dataset for selected columns
var largestEntry = 0; //Largest value in the dataset for selected columns
var plotCenterVec3; //Centerpoint of visualization in world space
var datasetAndAxisLabelGroup;
var rig; //Rig to group camera

camera.name = "camera";

//For controls



var light0;

/**
 * Called every frame
 */
function update(timestamp) {
  if (timestamp == null) {
    //Fixes small lag at begining of program where
    //timestamp is null
    timestamp = 15;
  }
  lastRender = timestamp;
  // //Checking for dat.guivr error
  // console.log(timestamp);
  // var testObject = new THREE.Object3D();
  // var testInputHelper = dat.GUIVR.addInputObject(testObject);
  // console.log(testInputHelper);
  // scene.add(testInputHelper);

  //Add all updates below here

  //Ensure that we are looking for controller input
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //trackballControls.update(); //Comment out trackball controls to properly use keyboard controls
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  THREE.VRController.update();

  //Allows point selection to function

    updateMovementControls();

    pointSelectionUpdate();
  // set BufferGeometry object attributes to be updatable.
  // (This must be set every time you want the buffergeometry to change.
  pointsGeometry.getAttribute('customColor').needsUpdate = true;
  pointsGeometry.getAttribute('position').needsUpdate = true;
  pointsGeometry.getAttribute('size').needsUpdate = true;
  pointsGeometry.getAttribute('isSelected').needsUpdate = true;
  pointsGeometry.getAttribute('isHidden').needsUpdate = true;
}

/**
 * Draw game objects to the scene
 */
function render(timestamp) {

  if (enterVR.isPresenting()) {
    vrControls.update();
    renderer.render(scene, camera);
    effect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }
}

/**
 * Manages program logic. Update, Render, Repeat
 * DO NOT add anything to this.
 */
function GameLoop(timestamp){
  update(timestamp);
  render(timestamp);
  //Allows this to be called every frame
  
  window.requestAnimationFrame(GameLoop);
};

/**
 * Manages retrieval of existing worlds from the database and initializes the
 * current scene.
 */

function Manager() {
  //Initialize camera, scene, and renderer
  //First get the scene from the data base
  var retrievedString = sessionStorage.getItem('selectedID');
  worldID = JSON.parse(retrievedString);
  console.log('worldID is: '+worldID);
  scene = new THREE.Scene();
  var worldURL = '/worlds/' + worldID;

  /**
   * FIREBASE GET
  */

  function loadScene(response){
    var loader = new THREE.ObjectLoader();
    var object = loader.parse(response);
    scene.add(object);
    loadedDataset = object.userData;
    console.log("Loaded Dataset:");
    console.log(" - Index 0 = Selected axes");
    console.log(" - Index 1 = Column labels");
    console.log(" - Index >1 = Entire dataset");
    console.log(loadedDataset);
    console.log("Retrieved Scene Object:");
    console.log(object);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.vr.enabled = true;
    renderer.vr.standing = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
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
        renderer.vr.setDevice(display);
        animationDisplay = display;
        setStageDimensions(display.stageParameters);
        camera.position.set(plotInitSizeX / 2.0, plotInitSizeY * 1.5, camera.position.z);
        camera.rotation.y = 270 * Math.PI / 180;
      })
      .catch(function() {
        // If there is no display available, fallback to window
        animationDisplay = window;
      });

    //This can be removed after development if desired
    drawFPSstats();

    //Initializes the axis selection interfaces
    axisMenu = new selectedAxes();
    selectedAxes = new selectedAxesVR();
    
    //Builds the GUIs
    VRGui();
    // BRGui(); May break things dont uncomment

    //Uncomment if you need to use mouse as input for GUI in VR
    dat.GUIVR.enableMouse(camera,renderer);

    // axisMenu contains the 3 selected axis columns as properties
    drawDataset(axisMenu.xAxis,axisMenu.yAxis,axisMenu.zAxis);
    //Handle Keyboard Input
    document.addEventListener('keydown', onAKeyPress, false);
    

    //Center the non-VR camera on the data and back a bit

    camera.position.set(-1,0,0);
    camera.rotation.y = 0 * Math.PI / 180;
 //   onAxisDatabaseChange(worldID);
    //GameLoop must be called last after everything to ensure that
    //everything is rendered
    GameLoop();
  }

  console.log("Getting Scene from Firebase... (May take a few moments for large datasets).");
  readWorld(worldID, loadScene);
}

/**
 * This draws the fps and various stats to the page.
 * Click on the widget to see other stats.
 * Can be removed after development.
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


/**
 * Listens and adapts the aspect ratio and size of the canvas
 * This allows the scene to hold its shape when the browser is
 * resized.
 */
function onResize(e) {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  effect.setSize(windowHeight, windowWidth);
  renderer.setSize(windowWidth, windowHeight);
  camera.aspect = windowWidth / windowHeight;
  camera.updateProjectionMatrix();
}

/**
 * Determines whether or not a VR headset is available.
 * If not it allows the user to try without a headset as well
 * as offers a link to the webvr page to learn more.
 * On clicking enter vr the scene is loaded appropriately for the
 * headset.
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
      console.log("enter VR");
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

/**
 * These are the head controls as well as the ability to move around in 2d space. They do not correspond to the hand controls.
 */
function setUpControls() {
  //Initialize vrcontrols and match camera height to the user.
  vrControls = new THREE.VRControls(camera);
  vrControls.standing = true;
  camera.position.z = vrControls.userHeight;
  console.log("Initializing rig");

  rig = new THREE.Object3D();
  rig.add(camera);
  scene.add(rig);

  //Add fps controls as well
  trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 10;
  trackballControls.panSpeed = 10;
  trackballControls.noZoom = false;
  trackballControls.noPan = false;
  trackballControls.staticMoving = true;
  trackballControls.dynamicDampingFactor = 0.3;
  trackballControls.keys = [65, 83, 68];

  //Add selection controls
  initializeSelectionControls();

  //Apply VR stereo rendering to renderer.
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.floor(window.devicePixelRatio));

  //Set up controls gui
  applyDown = function(obj, key, value) {
    obj[key] = value;
    if (obj.children !== undefined && obj.children.length > 0) {

      obj.children.forEach(function(child) {

        applyDown(child, key, value)
      })
    }
  };
  castShadows = function(obj) {
    applyDown(obj, 'castShadow', true)
  };
  receiveShadows = function(obj) {
    applyDown(obj, 'receiveShadow', true)
  };

  //  DAT GUI for WebVR settings.
  //  https://github.com/dataarts/dat.guiVR
  
  
}



/**
 * Draws a 3D point-field/scatterplot graph representation of the input
 * dataset with reasonable initial scaling.
 *
 * Thanks to Dorian Thiessen who laid the foundational work for using
 * BufferGeometrys with shader definitions in VRWorld.ejs
 *
 * @precondition The CSV must be parsed so that loadedDataset is defined
 *
 * @param {Integer} xCol CSV column index for the x-axis
 * @param {Integer} yCol CSV column index for the y-axis
 * @param {Integer} zCol CSV column index for the z-axis
 *
 * @return 0 on success (Might change this to the mesh object itself).
 */
function drawDataset(xCol, yCol, zCol)
{
  assert(loadedDataset, 'loadedDataset must be defined for drawDataset()');
  assert(xCol >= 0,
    'drawDataset() xCol value must be a positive integer');
  assert(yCol >= 0,
    'drawDataset() yCol value must be a positive integer');
  assert(zCol >= 0,
    'drawDataset() zCol value must be a positive integer');

  // points geometry contains a list of all the point vertices pushed below
  pointsGeometry = new THREE.BufferGeometry();

  var pointSize = pointVars.plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ);

  // Grab the OpenGLSL shader definitions from page html
  var myVertexShader = document.getElementById( 'vertexshader' ).textContent;
  var myFragmentShader = document.getElementById( 'fragmentshader' ).textContent;

  //var texture = new THREE.TextureLoader().load( "images/cross.png" );

  // Configure point material shader
  var pointsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color:   { value: new THREE.Color( 0xffffff ) }//,
      // texture: { value: texture }
    },
    vertexShader: myVertexShader,
    fragmentShader: myFragmentShader
  });

  // Arrays to hold information to be passed into BufferGeometries
  var positions = new Float32Array( loadedDataset.length * 3 );
  var colors = new Float32Array( loadedDataset.length * 3 );
  var sizes = new Float32Array( loadedDataset.length );
  var selected = new Float32Array( loadedDataset.length );
  var hidden = new Float32Array( loadedDataset.length );

  // Base color object to be edited on each loop iteration below.
  var color = new THREE.Color();

  // Find largest XYZ values, and largest overall entry.
  for (var i = 1; i < loadedDataset.length; i++) {
    // Find the largest Entry, X, Y, and Z value ceilings in the data.
    if (loadedDataset[i][xCol] > largestX) {
      largestX = loadedDataset[i][xCol];
    }
    if (loadedDataset[i][yCol] > largestY) {
      largestY = loadedDataset[i][yCol];
    }
    if (loadedDataset[i][zCol] > largestZ) {
      largestZ = loadedDataset[i][zCol];
    }
    largestEntry = Math.max(largestX, largestY, largestZ);
  }

  for (var i = 1; i < loadedDataset.length; i++) {
    // create a point Vector3 with xyz coordinates equal to the fraction of
    // loadedDataset[i][xCol]/largestX times the initial plot size.
    var pX = (loadedDataset[i][xCol]/largestX)*plotInitSizeX;
    var pY = (loadedDataset[i][yCol]/largestY)*plotInitSizeY;
    var pZ = (loadedDataset[i][zCol]/largestZ)*plotInitSizeZ;
    var p = new THREE.Vector3(pX, pY, pZ);

    // Add Vector3 p to the positions array to be added to BufferGeometry.
    p.toArray( positions, i * 3 );

    // Set point color RGB values to magnitude of XYZ values
    color = colorFromXYZcoords(p);
    //color.setRGB(loadedDataset[i][xCol]/largestX, loadedDataset[i][yCol]/largestY, loadedDataset[i][zCol]/largestZ);
    color.toArray( colors, i * 3 );

    // Set the sizes of all the points to be added to BufferGeometry
    sizes[i] = pointSize;
  }

  // Vector3 representing the plot center point
  plotCenterVec3 = new THREE.Vector3(plotInitSizeX / 2.0, plotInitSizeY / 2.0, plotInitSizeZ / 2.0);

  // Add all the point information to the BufferGeometry
  pointsGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  pointsGeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
  pointsGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
  pointsGeometry.addAttribute( 'isSelected', new THREE.BufferAttribute( selected, 1 ) );
  pointsGeometry.addAttribute( 'isHidden', new THREE.BufferAttribute(hidden, 1) );

  // create the particle shader system
  pointsSystem = new THREE.Points(
    pointsGeometry,
    pointsMaterial);

  pointsSystem.name = "PointsSystem";
  // add it to the scene

  //Position the dataset in a reasonable spot. This will probably change when
  //we start implementing collaboration.
  pointsSystem.position.set(0, plotInitSizeY / -2.0, plotInitSizeZ * -1.5);
  pointsSystem.rotation.set(0,-0.785398,0);

  //Keep the drawn dataset and axis labels in a group.
  datasetAndAxisLabelGroup = new THREE.Group();
  datasetAndAxisLabelGroup.name ="DatasetAxisGroup";
  datasetAndAxisLabelGroup.add(pointsSystem);

  light0 = new THREE.HemisphereLight(0xffffbb,0x080820,1);
  scene.add(light0);
  scene.add(VRGui);
  drawAxisLabels();
  scene.add(datasetAndAxisLabelGroup);
  scene.add(rig);
}

/**
 * Indicates XYZ axes as Red, Blue, and Green lines respectively.
 * Drawn from the origin
 *
 * @precondition scene must be initialized
 * @postcondition axis labels are drawn from 0,0
 */

//TODO: Rewrite to allow for negative values.
function drawAxisLabels() {
  assert(scene, "Scene must be initialized for drawAxisLabels()");
  var axisLabelGroup = new THREE.Group();
  axisLabelGroup.name = "AxisLabelGroup";

  // Set line colors
  var materialX = new THREE.LineBasicMaterial({
    color: 0xff0000
  });
  var materialY = new THREE.LineBasicMaterial({
    color: 0x00ff00
  });
  var materialZ = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });

  // Create line geometries
  var geometryX = new THREE.Geometry();
  var geometryY = new THREE.Geometry();
  var geometryZ = new THREE.Geometry();

  // Push line points into geometries, extending 1.5X beyond the largest point
  geometryX.vertices.push(new THREE.Vector3(0, 0, 0));
  geometryX.vertices.push(new THREE.Vector3(plotInitSizeX * 1.5, 0, 0));

  geometryY.vertices.push(new THREE.Vector3(0, 0, 0));
  geometryY.vertices.push(new THREE.Vector3(0, plotInitSizeY * 1.5, 0));

  geometryZ.vertices.push(new THREE.Vector3(0, 0, 0));
  geometryZ.vertices.push(new THREE.Vector3(0, 0, plotInitSizeZ * 1.5));

  // Create line objects
  var lineX = new THREE.Line(geometryX, materialX);
  var lineY = new THREE.Line(geometryY, materialY);
  var lineZ = new THREE.Line(geometryZ, materialZ);

  // Add them to the scene
  axisLabelGroup.add(lineX);
  axisLabelGroup.add(lineY);
  axisLabelGroup.add(lineZ);

  // Axis line ticks - Just draws 10 ticks on each axis
  var lineXTicks = new LinkedList();
  for (var xUnits = 1; xUnits <= 10; xUnits++) {
    lineXTicks.add(new THREE.Geometry());
    lineXTicks.elementAt(xUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeX / largestX * xUnits, plotInitSizeY * 0.1, 0));
    lineXTicks.elementAt(xUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeX / largestX * xUnits, 0, 0));
    lineXTicks.elementAt(xUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeX / largestX * xUnits, 0, plotInitSizeZ * 0.1));
    axisLabelGroup.add(new THREE.Line(lineXTicks.elementAt(xUnits - 1), materialX));
  }
  var lineYTicks = new LinkedList();
  for (var yUnits = 1; yUnits <= 10; yUnits++) {
    lineYTicks.add(new THREE.Geometry());
    lineYTicks.elementAt(yUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeX * 0.1, plotInitSizeY / largestY * yUnits, 0));
    lineYTicks.elementAt(yUnits - 1).vertices.push(new THREE.Vector3(0, plotInitSizeY / largestY * yUnits, 0));
    lineYTicks.elementAt(yUnits - 1).vertices.push(new THREE.Vector3(0, plotInitSizeY / largestY * yUnits, plotInitSizeZ * 0.1));
    axisLabelGroup.add(new THREE.Line(lineYTicks.elementAt(yUnits - 1), materialY));
  }
  var lineZTicks = new LinkedList();
  for (var zUnits = 1; zUnits <= 10; zUnits++) {
    lineZTicks.add(new THREE.Geometry());
    lineZTicks.elementAt(zUnits - 1).vertices.push(new THREE.Vector3(0, plotInitSizeY * 0.1, plotInitSizeZ / largestZ * zUnits));
    lineZTicks.elementAt(zUnits - 1).vertices.push(new THREE.Vector3(0, 0, plotInitSizeZ / largestZ * zUnits));
    lineZTicks.elementAt(zUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeZ * 0.1, 0, plotInitSizeZ / largestZ * zUnits));
    axisLabelGroup.add(new THREE.Line(lineZTicks.elementAt(zUnits - 1), materialZ));
  }
  axisLabelGroup.position.set(0, plotInitSizeY / -2.0, plotInitSizeZ * -1.5);
  axisLabelGroup.rotation.set(0,-0.785398,0);
  datasetAndAxisLabelGroup.add(axisLabelGroup);
  //scene.add(axisLabelGroup);
}
