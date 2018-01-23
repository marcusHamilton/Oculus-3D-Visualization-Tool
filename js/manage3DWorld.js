/*
  This js file is responsible for building the 3D world
*/
//Set up essential global elemets
var scene;
var camera;
var renderer;
var windowWidth; //The width of the browser window
var windowHeight; //The height of the browser window
var listOfCubes = new LinkedList(); //Stores the objects in the world
var parsedData;

// largest datapoints for calcuating graph midpoint and camera zoom
var largestEntry;
var largestX;
var largestY;
var largestZ;

var graphCenter;

// Object for OrbitControls.js for orbital camera controls
var controls;

/*
Listens and adapts the aspect ratio and size of the canvas
This allows the scene to hold its shape when the browser is
resized.
*/
function listenForWindowResize()
{

  window.addEventListener('resize', function()
  {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer.setSize(windowWidth, windowHeight);
    camera.aspect = windowWidth/windowHeight;
    camera.updateProjectionMatrix();
  });
}

function retrieveCSVData()
{
  var retrievedObject = sessionStorage.getItem('parsedCSVData');
  parsedData = JSON.parse(retrievedObject);
}

//Called every frame
function update()
{
  for(var i = 0; i < listOfCubes.size(); i++)
  {
    listOfCubes.elementAt(i).rotation.x += 0.01;
    listOfCubes.elementAt(i).rotation.y += 0.005;
  }

  //requestAnimationFrame( animate );

  // required if controls.enableDamping or controls.autoRotate are set to true
  if (controls)
    controls.update();
}

//Draw game objects to the scene
function render()
{
  renderer.render(scene, camera);
}

//Manages program logic. Update, Render, Repeat
//DO NOT add anything to this.
var GameLoop = function ()
{
  //Allows this to be called every frame
  requestAnimationFrame(GameLoop);

  update();
  render();
}

/*
This function is responsible for building the world and creates the
data points passed from the csv
*/
function build3DSpace()
{
  //Recover the CSVData from the browsers webStorage
  retrieveCSVData();
  //Initialize camera, scene, and renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //Add the renderer to the html page
  document.body.appendChild(renderer.domElement);
  listenForWindowResize();


  //Create a shape
  var boxGeometry;
  var material;
  var cube;


  largestX = 0;
  largestY = 0;
  largestZ = 0;
  largestEntry = 0;

  // Loop through all the parsed data to generate a visualization
  for(var i = 0; i < parsedData.length; i++)
  {
    // Create a new cube object
    boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    material = new THREE.MeshBasicMaterial({color: (0xffffff), wireframe: false});
    cube = new THREE.Mesh(boxGeometry, material);

    // Position cube based on first 3 columns of input data
    cube.position.x = parsedData[i][0];
    cube.position.y = parsedData[i][1];
    cube.position.z = parsedData[i][2];

    // Find the X, Y, and Z value ceilings in the data.
    if (parsedData[i][0] > largestX){
      largestX = parsedData[i][0];
    }
    if (parsedData[i][1] > largestY){
      largestY = parsedData[i][1];
    }
    if (parsedData[i][2] > largestZ){
      largestZ = parsedData[i][2];
    }

    // Create Vector3 object representing the graph center point for camera
    // target
    graphCenter = new THREE.Vector3(largestX/2.0, largestY/2.0, largestZ/2.0);


    // Find largest entry across all axes to adjust initial camera zoom
    // (Probably doesn't need to search entire data set all over again).
    for(j = 0; j < 3; j++){
    	if (parsedData[i][j] > largestEntry){
    		largestEntry = parsedData[i][j];
    	}
    }

    scene.add(cube);
    listOfCubes.add(cube);
  }

  // Orbital camera control initialization
  var controls = new THREE.OrbitControls( camera );
  camera.position.set(graphCenter.x, graphCenter.y, largestEntry / 0.6);
  controls.target = graphCenter;
  controls.enableDamping;
  controls.autoRotate = true; // This isn't working for some reason.

  // controls.update() must be called after any manual changes to the camera's
  // transform

  setCubeColors();
  drawAxisLabels();
  drawFPSstats();
  //GameLoop must be called last after everything to ensure that
  //everything is rendered
  GameLoop();
}

// Indicates XYZ axes as Red, Blue, and Green lines respectively
// Drawn from the origin
function drawAxisLabels()
{
  var materialX = new THREE.LineBasicMaterial({color: 0xff0000});
  var materialY = new THREE.LineBasicMaterial({color: 0x00ff00});
  var materialZ = new THREE.LineBasicMaterial({color: 0x0000ff});

  var geometryX = new THREE.Geometry();
  var geometryY = new THREE.Geometry();
  var geometryZ = new THREE.Geometry();

  geometryX.vertices.push(new THREE.Vector3(0,0,0));
  geometryX.vertices.push(new THREE.Vector3(largestX * 1.5,0,0));

  geometryY.vertices.push(new THREE.Vector3(0,0,0));
  geometryY.vertices.push(new THREE.Vector3(0,largestY * 1.5,0));

  geometryZ.vertices.push(new THREE.Vector3(0,0,0));
  geometryZ.vertices.push(new THREE.Vector3(0,0,largestZ * 1.5));

  var lineX = new THREE.Line(geometryX, materialX);
  var lineY = new THREE.Line(geometryY, materialY);
  var lineZ = new THREE.Line(geometryZ, materialZ);

  scene.add(lineX);
  scene.add(lineY);
  scene.add(lineZ);
}

//Loops through the cube list and sets RGB color values based on
//()(XYZ Magnitude)/largestEntry) * 255
function setCubeColors()
{
  for(var i = 0; i < listOfCubes.size(); i++)
  {
    // Truncating the first and last 16 of each value avoids a querk in
    // toString(16) where it doesn't return leading zeros.
    var r = 16 + Math.round((listOfCubes.elementAt(i).position.x / largestX) * 239);
    var g = 16 + Math.round((listOfCubes.elementAt(i).position.y / largestY) * 239);
    var b = 16 + Math.round((listOfCubes.elementAt(i).position.z / largestZ) * 239);

    var colorHex = parseInt(r.toString(16) + g.toString(16) + b.toString(16), 16);

    listOfCubes.elementAt(i).material.color.setHex( colorHex );
  }
}

//This draws the fps and various stats to the page.
//Click on the widget to see other stats
//Can be removed after development
function drawFPSstats()
{
  (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()
}
