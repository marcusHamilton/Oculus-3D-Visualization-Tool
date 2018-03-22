/**
 * This JS file is responsible for the creation of a new 3d world.
 * It will take in a CSV file and in turn create a threejs world that contains the
 * CSV files data points. This will export a JSON file containing the scene.
 */
var THREE = require('../../public/javascripts/three/three.js');

var scene; //The scene to which all elements are added to


var parsedData; //Parsed data obtained from the CSV
var fileName; //Stored to give a meaningful name on the dashboard
//The following are to be accessed like so: parsedData[i][x_AxisIndex]
//parsedData[i][x_AxisIndex]
//parsedData[i][y_AxisIndex]
//parsedData[i][z_AxisIndex]
var x_AxisIndex; //The x-axis index of which to use for scatter plot positioning
var y_AxisIndex; //The y-axis of which to use for scatter plot positioning
var z_AxisIndex; //The z-axis of which to use for scatter plot positioning

function setParsedData(data){
  parsedData = data;
}

function setXAxisIndex(data){
  x_AxisIndex = data;
}

function setYAxisIndex(data){
  y_AxisIndex = data;
}

function setZAxisIndex(data){
  z_AxisIndex = data;
}

function setSceneForTesting(){
  //Initialize camera, scene, and renderer
  scene = new THREE.Scene();
  scene.name = "Scene";
  // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  //Add light and floor
  var light = new THREE.DirectionalLight(0xFFFFFF, 1, 100);
  light.position.set(1, 10, -0.5);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 12;
  scene.add(light);
  scene.add(new THREE.HemisphereLight(0x909090, 0x404040));
}

function getScene() {
  return scene;
}


/**
 * Function is called when the csv file is loaded in from the localLoad.
 * Here the uploaded file is grabbed from the html page and passed into a local //variable. Papa parse is then used to parse the data into an array.
 * header is turned off so that the array values are numerical. If it were set
 * to on then the file would be parsed as an object not an array. On the user is
 * prompted to input their axis values.
 */
function loadCSVLocal() {
  //Grab the file from the html dom system
  var file = document.getElementById('csv-file').files[0];
  fileName = file.name;

  Papa.parse(file, {
    //header: true,
    dynamicTyping: true,
    error: function(error) { //error callback
      SomethingWentWrong(error);
    },
    complete: function(results) { //success call back
      parsedData = results.data;
      success();
    }
  });

  //Message if there is success
  function success() {
    //Data is stored in the browser storage and can be retrieved and used on
    //other html pages
    getOptions();

    //Clean up webpage and notify of success
    var toRemove = document.getElementById('formGroup');
    document.getElementById('localLoadLabel').remove();
    toRemove.remove();
    var continueButton = document.getElementById('continueToVirtual');
    continueButton.innerHTML = '<a href="#" class="btn btn-success" role="button" onclick="getResults()">Continue</a> ';
  }

  //Message if there is an error
  function SomethingWentWrong(error) {
    console.log(error);

    //display error info on the webpage
    var message = document.getElementById('successMessage');
    message.innerHTML = '<br><div class="alert alert-danger"><strong>Error!</strong> ';
  }
}

/**
 * Function is called when the csv file is loaded in from the URL.
 * Here the uploaded file is grabbed from the html page and passed into a local //variable. Papa parse is then used to parse the data into an array.
 * header is turned off so that the array values are numerical. If it were set
 * to on then the file would be parsed as an object not an array. On the user is
 * prompted to input their axis values.
 */
function loadCSVremote() {
  //Grab the file from the html dom system
  var url = document.getElementById('csvURL').value;

  Papa.parse(url, {
    download: true,
    //header: true,
    dynamicTyping: true,
    error: function(error) { //error callback
      SomethingWentWrong(error);
    },
    complete: function(results) { //success call back
      parsedData = results.data;
      success();
    }
  });

  //Message if there is success
  function success() {
    //Data is stored in the browser storage and can be retrieved and used on
    //other html pages
    getOptions();


    //Clean up webpage and notify of success
    var toRemove = document.getElementById('urlBar');
    toRemove.remove();
    document.getElementById('localLoadLabel').remove();
    var continueButton = document.getElementById('continueToVirtual');
    continueButton.innerHTML = '<a href="#" class="btn btn-success" role="button" onclick="getResults()">Continue</a> ';
  }

  //Message if there is an error
  function SomethingWentWrong(error) {
    console.log(error);

    //display error info on the webpage
    var message = document.getElementById('successMessage');
    message.innerHTML = '<br><div class="alert alert-danger"><strong>Error!</strong> Wrong URL?</div> ';
  }
}

/**
 * @pre: csv was successfully parsed
 * @post: dropdownOptions contains the same length as data[0].length
 * Responsible for populating and displaying the dropdown menus on the load screen
 */
function getOptions() {
  var dropdownOptions = [];
  for (i = 0; i < parsedData[0].length; i++) {
    dropdownOptions.push({
      id: i,
      text: parsedData[0][i]
    });
  }

  $(document).ready(function() {
    $('.js-responsive-dropdown').select2({
      placeholder: 'Select axis',
      data: dropdownOptions,
      dropdownParent: $('.modal')
    });
  });

  document.getElementById("dropDownForInit").style = "display:block";

}

/**
 * Grabs values from the dropdown menu and sends them to session sessionStorage
 * with key 'initialAxisValues'
 */
function getResults() {
  //Get results from the dropdown
  x_AxisIndex = $('#x-axis :selected').val();
  y_AxisIndex = $('#y-axis :selected').val();
  z_AxisIndex = $('#z-axis :selected').val();
  //All commented out because select2 stopped working in modal box
  //var XAxis = $('#x-axis').select2('data');
  //var YAxis = $('#y-axis').select2('data');
  //var ZAxis = $('#z-axis').select2('data');
  //Remove the objects
  //XAxis = XAxis[0].id;
  //YAxis = YAxis[0].id;
  //ZAxis = ZAxis[0].id;
  build3DSpace();
}

/**
 * Below is everything necessary to build a new 3d world
 */



function build3DSpace() {
  //Initialize camera, scene, and renderer
  scene = new THREE.Scene();
  scene.name = "Scene";
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  //Add light and floor
  var light = new THREE.DirectionalLight(0xFFFFFF, 1, 100);
  light.position.set(1, 10, -0.5);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 12;
  scene.add(light);
  scene.add(new THREE.HemisphereLight(0x909090, 0x404040));
  addParsedDataToScene();

  //Export the built world
  var sceneJSON = this.scene.toJSON();
  console.log(JSON.stringify(sceneJSON));
  sceneJSON = JSON.parse(JSON.stringify(sceneJSON));

  writeWorld(sceneJSON); //writes the world and logs the world id
  $('#myModal').modal('hide');
  console.log('world written');
  reloadWorlds();
}

/**
 * Sets scene.userData to contain the selected axis indices and parsed data
 * array.
 * @pre parsedData must be defined
 * @pre x_AxisIndex must be >= 0
 * @pre y_AxisIndex must be >= 0
 * @pre z_AxisIndex must be >= 0
 */
function addParsedDataToScene()
{
  assert(parsedData,"");
  assert(x_AxisIndex >= 0,"");
  assert(y_AxisIndex >= 0,"");
  assert(z_AxisIndex >= 0,"");

  // scene.userData = Array.concat([[x_AxisIndex,y_AxisIndex,z_AxisIndex]], parsedData);
  scene.userData = [x_AxisIndex,y_AxisIndex,z_AxisIndex].concat(parsedData);

  scene.name = fileName;

}

/**
 * Temporary assertion because I don't know how to work node.js
 * @param condition {Boolean} assertion
 * @param message {String} Failure message
 */
function assert(condition, message) {
  if (!condition) {
    throw message || "Assertion failed";
  }
}

module.exports.setParsedData = setParsedData;
module.exports.setXAxisIndex = setXAxisIndex;
module.exports.setYAxisIndex = setYAxisIndex;
module.exports.setZAxisIndex = setZAxisIndex;
module.exports.setSceneForTesting = setSceneForTesting;
module.exports.addParsedDataToScene = addParsedDataToScene;
module.exports.getScene = getScene;
