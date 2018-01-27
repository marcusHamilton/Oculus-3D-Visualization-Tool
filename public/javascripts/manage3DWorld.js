/*
  This js file is responsible for building the 3D world
*/

//Set up essential global elements
var scene;
var camera;
var renderer;
var windowWidth; //The width of the browser window
var windowHeight; //The height of the browser window
var listOfCubes = new LinkedList(); //Stores the objects in the world
var parsedData;

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
  for(var i = 0; i < parsedData.length; i++)
  {
    boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    cube = new THREE.Mesh(boxGeometry, material);
    cube.position.z = (i*-2)
    cube.position.x = (i*-2)
    scene.add(cube);
    listOfCubes.add(cube);
  }
  //Move camera back so that you are not inside the first cube
  camera.position.z = 3;


  drawFPSstats();
  //GameLoop must be called last after everything to ensure that
  //everything is rendered
  GameLoop();
}

//This draws the fps and various stats to the page.
//Click on the widget to see other stats
//Can be removed after development
function drawFPSstats()
{
  (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()
}
