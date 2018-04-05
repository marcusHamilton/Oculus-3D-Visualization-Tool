
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
var largestX; //Largest X value in the dataset for selected columns
var largestY; //Largest Y value in the dataset for selected columns
var largestZ; //Largest Z value in the dataset for selected columns
var smallestX;
var smallestY;
var smallestZ;
var largestEntry = 0; //Largest value in the dataset for selected columns
var plotCenterVec3; // Centerpoint of visualization in world space
var axisLabelGroup; // This group contains the text meshes for the axis labels
var datasetAndAxisLabelGroup; //This group contains the points system and axis labels
var userPresence; //hold th reference for the users player sphere and camera
var otherUsers = []; //Hold the references to the other users spheres7
var slowDownUserPos = 0;

// min and max *world position* values for each vertex in the points system
var largestXpos;
var largestYpos;
var largestZpos;
var smallestXpos;
var smallestYpos;
var smallestZpos;

var collabGroup;

var isFontReady = false; // Boolean to make sure the 3D font is loaded before using it.
var loadedFont; // An object representing the 3D font


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
  if(statsLabelGroup != null && VRGui != null){
	statsLabelGroup.position.x = VRGui.position.x;
	statsLabelGroup.position.y = VRGui.position.y + 0.36;
	statsLabelGroup.position.z = VRGui.position.z;
	statsLabelGroup.rotation.x = VRGui.rotation.x;
	statsLabelGroup.rotation.y = VRGui.rotation.y;
	statsLabelGroup.rotation.z = VRGui.rotation.z;
	statsLabelGroup.scale.x = 0.25;
	statsLabelGroup.scale.y = 0.25;
	statsLabelGroup.scale.z = 0.3;
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

  //updateMovementControls();
  if(datasetAndAxisLabelGroup != null){
    updatePointsPosition();
  }
  slowDownUserPos ++;
  if(slowDownUserPos >= 5){
    updateUserPositionInDatabase(worldID, getUID());
    slowDownUserPos = 0;
  }

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

  initLabelFont();
  console.log("Loading Helvetiker_Regular");

  var worldURL = '/worlds/' + worldID;

  /**
   * FIREBASE GET
   */

  function loadScene(response){
    var t1 = performance.now();

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

    var t2 = performance.now();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.name = "camera";
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.vr.enabled = true;
    renderer.vr.standing = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    //Add the renderer to the html page
    document.body.appendChild(renderer.domElement);

    var t3 = performance.now();

    // Handle canvas resizing
    window.addEventListener('resize', onResize, true);
    window.addEventListener('vrdisplaypresentchange', onResize, true);
    setUpControls();
    addEnterVrButtons();

    var t4 = performance.now();
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

    var t5 = performance.now();

    //This can be removed after development if desired
    drawFPSstats();

    //Initializes the axis selection interfaces
    axisMenu = new SelectedAxes();
    selectedAxes = new SelectedAxesVR();

    var t6 = performance.now();
    
    //Builds the GUIs
    VRGui();

    var t7 = performance.now();

    initAxisMenu();
    // BRGui(); May break things dont uncomment

    //Uncomment if you need to use mouse as input for GUI in VR
    dat.GUIVR.enableMouse(camera,renderer);

    var t8 = performance.now();

    // axisMenu contains the 3 selected axis columns as properties
    drawDataset(axisMenu.xAxis,axisMenu.yAxis,axisMenu.zAxis);

    var t9 = performance.now();

    scaleInterface = new ScaleObject();
    scaleMenu();

    var t10 = performance.now();
    
    //Handle Keyboard Input
    document.addEventListener('keydown', onAKeyPress, false);


    //Center the non-VR camera on the data and back a bit

    camera.position.set(-1,0,0);
    camera.rotation.y = 0 * Math.PI / 180;

    collabGroup = new THREE.Group();
    collabGroup.add(datasetAndAxisLabelGroup);
    scene.add(collabGroup);
    var t11 = performance.now();

    for(var i = 0; i<10; i++){
      otherUsers[i] = newPlayerSphere();
      collabGroup.add(otherUsers[i]);
    }

    var t12 = performance.now();
    onAxisDatabaseChange(worldID);
    var t13 = performance.now();
    onUserPositionChange(worldID, getUID());
    var t14 = performance.now();
    onSelectionChange(worldID);
    var t15 = performance.now();
    scene.add(light0);
    scene.add(VRGui);
    scene.add(userPresence);
	drawSelectionStats();
    //GameLoop must be called last after everything to ensure that
    //everything is rendered
    var t16 = performance.now();

    GameLoop();
    
    console.log("Execution of loadScene took: " + (t16-t1) + " ms" + '\n' +
      'Part 1: ' + (t2-t1) + '\n' +
      'Part 2: ' + (t3-t2) + '\n' +
      'Part 3: ' + (t4-t3) + '\n' +
      'Part 4: ' + (t5-t4) + '\n' +
      'Part 5: ' + (t6-t5) + '\n' +
      'Part 6: ' + (t7-t6) + '\n' +
      'Part 7: ' + (t8-t7) + '\n' +
      'Part 8: ' + (t9-t8) + '\n' +
      'Part 9: ' + (t10-t9) + '\n' +
      'Part 10: ' + (t11-t10) + '\n' +
      'Part 11: ' + (t12-t11) + '\n' +
      'Part 12: ' + (t13-t12) + '\n' +
      'Part 13: ' + (t14-t13) + '\n' +
      'Part 14: ' + (t15-t14) + '\n' +
      'Part 15: ' + (t16-t15)
       );
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
  
  camera.add(rig);

  userPresence = newPlayerSphere();
  camera.add(userPresence);

  scene.add(camera);

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

  // The .png file to use for the point field icons
  var texture = new THREE.TextureLoader().load( "images/shader3.png" );

  // Configure point material shader
  var pointsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color:   { value: new THREE.Color( 1,1,1 ) },
      texture: { value: texture }
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

  // Min and max values in the parsed dataset.
  largestX = loadedDataset[2][xCol];
  largestY = loadedDataset[2][yCol];
  largestZ = loadedDataset[2][zCol];
  smallestX = loadedDataset[2][xCol];
  smallestY = loadedDataset[2][yCol];
  smallestZ = loadedDataset[2][zCol];


  // Find largest XYZ values, and largest overall entry.
  for (var i = 2; i < loadedDataset.length - 2 ;i++) {
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
    if (loadedDataset[i][xCol] < smallestX) {
      smallestX = loadedDataset[i][xCol];
    }
    if (loadedDataset[i][yCol] < smallestY) {
      smallestY = loadedDataset[i][yCol];
    }
    if (loadedDataset[i][zCol] < smallestZ) {
      smallestZ = loadedDataset[i][zCol];
    }
    largestEntry = Math.max(largestX, largestY, largestZ);
  }

  // The span between min and max value in each axis
  var dx = (largestX - smallestX);
  var dy = (largestY - smallestY);
  var dz = (largestZ - smallestZ);

  /*
  var mx = (largestX + smallestX)/2;
  var my = (largestY + smallestY)/2;
  var mz = (largestZ + smallestZ)/2;
  */

  for (var i = 2; i < loadedDataset.length; i++) {
    // create a point Vector3 with xyz coordinates equal to the fraction of
    // loadedDataset[i][xCol]/largestX times the initial plot size.
    var pX = ((loadedDataset[i][xCol]/* - mx*/)/dx)*plotInitSizeX;
    var pY = ((loadedDataset[i][yCol]/* - my*/)/dy)*plotInitSizeY;
    var pZ = ((loadedDataset[i][zCol]/* - mz*/)/dz)*plotInitSizeZ;
    var p = new THREE.Vector3(pX, pY, pZ);

    // Add Vector3 p to the positions array to be added to BufferGeometry.
    p.toArray( positions, i * 3 );

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

  light0 = new THREE.HemisphereLight(0xffffff,0xffffff,1);


  drawAxisLabels();

  for (var i = 0; i < pointsGeometry.getAttribute('position').array.length; i += 3){
      // Set point color RGB values to magnitude of XYZ values
      color = colorFromXYZcoords(new THREE.Vector3(
          pointsGeometry.getAttribute('position').array[i],
          pointsGeometry.getAttribute('position').array[i+1],
          pointsGeometry.getAttribute('position').array[i+2]
      ));
      color.toArray(colors, i);
    }
	
  //color origin point black for now
  setPointColor(0, new THREE.Color(0,0,0));
  initializeSelectionControls();
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
  if(axisLabelGroup != null
    && axisLabelGroup.children[3].geometry.parameters.text == axisMenu.axesOptions[loadedDataset[0][0]] + " = " + largestX
    && axisLabelGroup.children[4].geometry.parameters.text == axisMenu.axesOptions[loadedDataset[0][1]] + " = " + largestY
    && axisLabelGroup.children[5].geometry.parameters.text == axisMenu.axesOptions[loadedDataset[0][2]] + " = " + largestZ
    ){
    datasetAndAxisLabelGroup.add(axisLabelGroup);
    return;
  }
  axisLabelGroup = new THREE.Group();
  axisLabelGroup.name = "AxisLabelGroup";

  // Set line colors
  var materialX = new THREE.LineBasicMaterial({
    color: 0x770000
  });
  var materialY = new THREE.LineBasicMaterial({
    color: 0x007700
  });
  var materialZ = new THREE.LineBasicMaterial({
    color: 0x000077
  });

  // Create line geometries
  var geometryX = new THREE.Geometry();
  var geometryY = new THREE.Geometry();
  var geometryZ = new THREE.Geometry();

  largestXpos = Number.MIN_VALUE;
  largestYpos = Number.MIN_VALUE;
  largestZpos = Number.MIN_VALUE;
  smallestXpos = Number.MAX_VALUE;
  smallestYpos = Number.MAX_VALUE;
  smallestZpos = Number.MAX_VALUE;

  // Find smallest/largest XYZ positions
  for (var i = 0; i < pointsGeometry.getAttribute('position').array.length; i += 3) {
    // Find the largest Entry, X, Y, and Z value ceilings in the data.
    if (pointsGeometry.getAttribute('position').array[i] > largestXpos) {
      largestXpos = pointsGeometry.getAttribute('position').array[i];
    }
    if (pointsGeometry.getAttribute('position').array[i+1] > largestYpos) {
      largestYpos = pointsGeometry.getAttribute('position').array[i+1];
    }
    if (pointsGeometry.getAttribute('position').array[i+2] > largestZpos) {
      largestZpos = pointsGeometry.getAttribute('position').array[i+2];
    }
    // Find the smallest Entry, X, Y, and Z value floors in the data.
    if (pointsGeometry.getAttribute('position').array[i] < smallestXpos) {
      smallestXpos = pointsGeometry.getAttribute('position').array[i];
    }
    if (pointsGeometry.getAttribute('position').array[i+1] < smallestYpos) {
      smallestYpos = pointsGeometry.getAttribute('position').array[i+1];
    }
    if (pointsGeometry.getAttribute('position').array[i+2] < smallestZpos) {
      smallestZpos = pointsGeometry.getAttribute('position').array[i+2];
    }
  }
  //console.log("Smallest: " + smallestXpos + ", " + smallestYpos + ", " + smallestZpos);
  //console.log("Largest: " + largestXpos + ", " + largestYpos + ", " + largestZpos);

  // Push line points into geometries, extending 1.5X beyond the largest point
  geometryX.vertices.push(new THREE.Vector3(smallestXpos, 0, 0));
  geometryX.vertices.push(new THREE.Vector3(largestXpos, 0, 0));

  geometryY.vertices.push(new THREE.Vector3(0, smallestYpos, 0));
  geometryY.vertices.push(new THREE.Vector3(0, largestYpos, 0));

  geometryZ.vertices.push(new THREE.Vector3(0, 0, smallestZpos));
  geometryZ.vertices.push(new THREE.Vector3(0, 0, largestZpos));

  // Create line objects
  var lineX = new THREE.Line(geometryX, materialX);
  var lineY = new THREE.Line(geometryY, materialY);
  var lineZ = new THREE.Line(geometryZ, materialZ);

  // Add them to the scene
  axisLabelGroup.add(lineX);
  axisLabelGroup.add(lineY);
  axisLabelGroup.add(lineZ);

  // Add text labels to the axisLabelGroup
  if (largestX > 0)
  drawTextLabel(loadedDataset[1][loadedDataset[0][0]] + " = " + largestX, 0.1,
    new THREE.Color(1,0,0), new THREE.Vector3(largestXpos,0,0), axisLabelGroup);

  if (largestY > 0)
  drawTextLabel(loadedDataset[1][loadedDataset[0][1]] + " = " + largestY, 0.1,
    new THREE.Color(0,1,0), new THREE.Vector3(0,largestYpos,0), axisLabelGroup);

  if (largestZ > 0)
  drawTextLabel(loadedDataset[1][loadedDataset[0][2]] + " = " + largestZ, 0.1,
    new THREE.Color(0,0,1), new THREE.Vector3(0,0,largestZpos), axisLabelGroup);

  if (smallestX < 0)
  drawTextLabel(loadedDataset[1][loadedDataset[0][0]] + " = " + smallestX, 0.1,
    new THREE.Color(1,0,0), new THREE.Vector3(smallestXpos,0,0), axisLabelGroup);

  if (smallestY < 0)
  drawTextLabel(loadedDataset[1][loadedDataset[0][1]] + " = " + smallestY, 0.1,
    new THREE.Color(0,1,0), new THREE.Vector3(0,smallestYpos,0), axisLabelGroup);

  if (smallestZ < 0)
  drawTextLabel(loadedDataset[1][loadedDataset[0][2]] + " = " + smallestZ, 0.1,
    new THREE.Color(0,0,1), new THREE.Vector3(0,0,smallestZpos), axisLabelGroup);

  drawTextLabel("(0,0,0)", 0.1, new THREE.Color(1,1,1), new THREE.Vector3(0,0,0), axisLabelGroup);

  axisLabelGroup.position.set(0, plotInitSizeY / -2.0, plotInitSizeZ * -1.5);
  axisLabelGroup.rotation.set(0,-0.785398,0);
  datasetAndAxisLabelGroup.add(axisLabelGroup);
}

function newPlayerSphere(){
  var playerColour = new THREE.Color(Math.random(),Math.random(),Math.random());
  var playerGeometry = new THREE.SphereGeometry(.5,25,25);
  var playerMaterial = new THREE.MeshBasicMaterial({color: playerColour});
  var playerSphere = new THREE.Mesh(playerGeometry, playerMaterial);
  playerSphere.visible = false;
  return playerSphere;
}


/**
 * Creates a THREE.Mesh object 3D representation of a text string and
 * adds it to a group.
 * @param labelString {String} : The text take make a mesh for
 * @param textSize {Number} : The size of the font
 * @param color {THREE.Color} : The color
 * @param position {THREE.Vector3} : Initial position.
 * @param group {THREE.Object3D} : The group to add the mesh to.
 */
function drawTextLabel(labelString, textSize, color, position, group) {
  var loader = new THREE.FontLoader();
  loader.setPath('');
  // If the font hasn't been loaded yet, go ahead and do that here.
  if (!isFontReady){
    console.log("Font not ready, loading now.");
    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        loadedFont = font;
        var geometry = new THREE.TextGeometry(labelString, {
          font: font,
          size: textSize,
          height: .005,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 10,
          bevelSize: 8,
          bevelSegments: 5
        });
        var fontMaterial = new THREE.MeshPhongMaterial({color: color});
        var textMesh = new THREE.Sprite(geometry, fontMaterial);
        textMesh.position.set(position.x, position.y, position.z)
        textMesh.name = "label";
        group.add(textMesh);
      },
      function (e) {
        console.log("onProgress callback");
        console.log(e);
      },
      function (e) {
        console.log("onError callback");
        console.log(e);
      });
  }
  else { // If the font has been loaded, just use it.
    var geometry = new THREE.TextGeometry(labelString, {
      font: loadedFont,
      size: textSize,
      height: .005,
      curveSegments: 6,
      bevelEnabled: false
    });
    var fontMaterial = new THREE.MeshPhongMaterial({color: color});
    var textMesh = new THREE.Mesh(geometry, fontMaterial);
    textMesh.position.set(position.x, position.y, position.z);
    textMesh.name = "label";
    // Add the text mash to the specified group
    group.add(textMesh);
  }
}

/**
 * Load the 3D Helvetiker_Regular font from the .json file.
 */
function initLabelFont(){
  var loader = new THREE.FontLoader();
  loader.setPath('');
  loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
      loadedFont = font;
      isFontReady = true;
      console.log("Helvetiker_Regular loaded.");
    },
    function(e) {
      console.log("onProgress callback");
      console.log(e);
    },
    function(e) {
      console.log("onError callback");
      console.log(e);
    });
}
