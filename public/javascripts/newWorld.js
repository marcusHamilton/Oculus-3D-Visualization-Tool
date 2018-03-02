/*
 *This JS file is responsible for the creation of a new 3d world.
 *It will take in a CSV file and in turn create a threejs world that contains the
 *CSV files data points. This will export a JSON file containing the scene.
 */

/*First step, handle the CSV dataset*/

//Global variable for storing the csv data
var parsedData; //Parsed data obtained from the CSV
//The following are to be accessed like so: parsedData[i][x_AxisIndex]
//parsedData[i][x_AxisIndex]
//parsedData[i][y_AxisIndex]
//parsedData[i][z_AxisIndex]
var x_AxisIndex; //The x-axis index of which to use for scatter plot positioning
var y_AxisIndex; //The y-axis of which to use for scatter plot positioning
var z_AxisIndex; //The z-axis of which to use for scatter plot positioning

var pointsSystem;

/*
//Function is called when the csv file is loaded in from the localLoad.
//Here the uploaded file is grabbed from the html page and passed into a local //variable. Papa parse is then used to parse the data into an array.
//header is turned off so that the array values are numerical. If it were set
//to on then the file would be parsed as an object not an array. On the user is
//prompted to input their axis values.
*/
function loadCSVLocal() {
  //Grab the file from the html dom system
  var file = document.getElementById('csv-file').files[0];

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


/*
//Function is called when the csv file is loaded in from the URL.
//Here the uploaded file is grabbed from the html page and passed into a local //variable. Papa parse is then used to parse the data into an array.
//header is turned off so that the array values are numerical. If it were set
//to on then the file would be parsed as an object not an array. On the user is
//prompted to input their axis values.
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

/*
@pre: csv was successfully parsed
@post: dropdownOptions contains the same length as data[0].length
Responsible for populating and displaying the dropdown menus on the load screen
*/
function getOptions() {
  var dropdownOptions = [];
  for (i = 0; i < parsedData[0].length; i++) {
    dropdownOptions.push({
      id: i,
      text: parsedData[0][i]
    });
  };

  $(document).ready(function() {
    $('.js-responsive-dropdown').select2({
      placeholder: 'Select axis',
      data: dropdownOptions,
      dropdownParent: $('.modal')
    });
  });

  document.getElementById("dropDownForInit").style = "display:block";

}

/*
Grabs values from the dropdown menu and sends them to session sessionStorage
with key 'initialAxisValues'
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




/*
 *Below is everything nessesary to build a new 3d world
 */

var scene; //The scene to which all elements are added to
// largest value in the dataset for each axis.
var largestX = 0;
var largestY = 0;
var largestZ = 0;
// largest value overall.
var largestEntry = 0;
// calculated center point of the plot
var plotCenterVec3;
//Global constants for config (Move these to a json config file or something)

var plotInitSizeX = 10;
var plotInitSizeY = 5;
var plotInitSizeZ = 10;
var plotPointSizeCoeff = 0.01;

function build3DSpace() {
  //Initialize camera, scene, and renderer
  scene = new THREE.Scene();
  scene.name = "Scene";
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
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

  drawDataset(x_AxisIndex, y_AxisIndex, z_AxisIndex);

  //Export the built world
  //var sceneJSON = JSON.strigify(scene);
  var sceneJSON = this.scene.toJSON();

  try {

    sceneJSON = JSON.stringify(sceneJSON, parseNumber, '\t');
    sceneJSON = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

  } catch (e) {

    sceneJSON = JSON.stringify(sceneJSON);

  }
  console.log("About to post:" + sceneJSON);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: '/uploadWorld',
    data: sceneJSON,
    success: function(response) {
      $('#myModal').modal('hide');
      console.log("Post response is: " + response);
      reloadWorlds();
    }
  });
}


/**
 * Draws a 3D point-field/scatterplot graph representation of the input
 * dataset with reasonable initial scaling.
 *
 * Thanks to Dorian Thiessen who laid the foundational work for using
 * BufferGeometrys with shader definitions in VRWorld.ejs
 *
 * @precondition The CSV must be parsed so that parsedData is defined
 *
 * @param {Integer} xCol CSV column index for the x-axis
 * @param {Integer} yCol CSV column index for the y-axis
 * @param {Integer} zCol CSV column index for the z-axis
 *
 * @return 0 on success (Might change this to the mesh object itself).
 */
function drawDataset(xCol, yCol, zCol)
{
    assert(parsedData, 'parsedData must be defined for drawDataset()');
    assert(xCol >= 0,
        'drawDataset() xCol value must be a positive integer');
    assert(yCol >= 0,
        'drawDataset() yCol value must be a positive integer');
    assert(zCol >= 0,
        'drawDataset() zCol value must be a positive integer');

    // points geometry contains a list of all the point vertices pushed below
    pointsGeometry = new THREE.BufferGeometry();

    var pointSize = plotPointSizeCoeff * Math.max(plotInitSizeX, plotInitSizeY, plotInitSizeZ);

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
        fragmentShader: myFragmentShader,
    });

    // Arrays to hold information to be passed into BufferGeometries
    var positions = new Float32Array( parsedData.length * 3 );
    var colors = new Float32Array( parsedData.length * 3 );
    var sizes = new Float32Array( parsedData.length );
    var selected = new Uint8Array(parsedData.length);

    // Base color object to be edited on each loop iteration below.
    var color = new THREE.Color();

    for (var i = 0; i < parsedData.length; i++) {
        // Find the largest Entry, X, Y, and Z value ceilings in the data.
        if (parsedData[i][xCol] > largestX) {
            largestX = parsedData[i][xCol];
        }
        if (parsedData[i][yCol] > largestY) {
            largestY = parsedData[i][yCol];
        }
        if (parsedData[i][zCol] > largestZ) {
            largestZ = parsedData[i][zCol];
        }
        largestEntry = Math.max(largestX, largestY, largestZ);

        // create a point Vector3 with xyz coordinates equal to the fraction of
        // parsedData[i][xCol]/largestX times the initial plot size.
        var pX = (parsedData[i][xCol]/largestX)*plotInitSizeX;
        var pY = (parsedData[i][yCol]/largestY)*plotInitSizeY;
        var pZ = (parsedData[i][zCol]/largestZ)*plotInitSizeZ;
        var p = new THREE.Vector3(pX, pY, pZ);

        // Add Vector3 p to the positions array to be added to BufferGeometry.
        p.toArray( positions, i * 3 );

        // Set point color RGB values to magnitude of XYZ values
        color.setRGB(parsedData[i][xCol]/largestX, parsedData[i][yCol]/largestY, parsedData[i][zCol]/largestZ);
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

    // create the particle shader system
    pointsSystem = new THREE.Points(
        pointsGeometry,
        pointsMaterial);

  pointsSystem.name = "PointsSystem";
    // add it to the scene
    scene.add(pointsSystem);

    drawAxisLabels();
}

/**
 * Indicates XYZ axes as Red, Blue, and Green lines respectively.
 * Drawn from the origin
 *
 * @precondition scene must be initialized
 *
 * @postcondition axis labels are drawn from 0,0
 */
function drawAxisLabels() {
  assert(scene, "Scene must be initialized for drawAxisLabels()");

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
  scene.add(lineX);
  scene.add(lineY);
  scene.add(lineZ);

  // Grid lines
  var lineXTicks = new LinkedList();
  for (var xUnits = 1; xUnits <= Math.ceil(largestX); xUnits++) {
    lineXTicks.add(new THREE.Geometry());
    lineXTicks.elementAt(xUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeX / largestX * xUnits, plotInitSizeY, 0));
    lineXTicks.elementAt(xUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeX / largestX * xUnits, 0, 0));
    lineXTicks.elementAt(xUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeX / largestX * xUnits, 0, plotInitSizeZ));
    scene.add(new THREE.Line(lineXTicks.elementAt(xUnits - 1), materialX));
  }
  var lineYTicks = new LinkedList();
  for (var yUnits = 1; yUnits <= Math.ceil(largestY); yUnits++) {
    lineYTicks.add(new THREE.Geometry());
    lineYTicks.elementAt(yUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeX, plotInitSizeY / largestY * yUnits, 0));
    lineYTicks.elementAt(yUnits - 1).vertices.push(new THREE.Vector3(0, plotInitSizeY / largestY * yUnits, 0));
    lineYTicks.elementAt(yUnits - 1).vertices.push(new THREE.Vector3(0, plotInitSizeY / largestY * yUnits, plotInitSizeZ));
    scene.add(new THREE.Line(lineYTicks.elementAt(yUnits - 1), materialY));
  }
  var lineZTicks = new LinkedList();
  for (var zUnits = 1; zUnits <= Math.ceil(largestZ); zUnits++) {
    lineZTicks.add(new THREE.Geometry());
    lineZTicks.elementAt(zUnits - 1).vertices.push(new THREE.Vector3(0, plotInitSizeY, plotInitSizeZ / largestZ * zUnits));
    lineZTicks.elementAt(zUnits - 1).vertices.push(new THREE.Vector3(0, 0, plotInitSizeZ / largestZ * zUnits));
    lineZTicks.elementAt(zUnits - 1).vertices.push(new THREE.Vector3(plotInitSizeZ, 0, plotInitSizeZ / largestZ * zUnits));
    scene.add(new THREE.Line(lineZTicks.elementAt(zUnits - 1), materialZ));
  }
}

/**
 * Computes a color hex value based on the magnitudes of the xyz values in
 * vec3 in relation to the largest value in each axis.
 *
 * @param {Vector3} vec3 a position in world space.
 *
 * @return {Number} integer color value from position.
 */
function colorFromXYZcoords(vec3) {

  var r = 0;
  var g = 0;
  var b = 0;
  // Truncating the first and last 16 of each value because
  // toString(16) doesn't return leading zeros.
  if (largestX > 0 && largestY > 0 && largestZ > 0) {
    r = 16 + Math.round((vec3.x / largestX) * 239);
    g = 16 + Math.round((vec3.y / largestY) * 239);
    b = 16 + Math.round((vec3.z / largestZ) * 239);
  }
  // Assemble the RGB components in a color value.
  return parseInt(r.toString(16) + g.toString(16) + b.toString(16), 16);
}
/**
 * Adjusts the color of a singular datapoint.
 *
 * @precondition pointsGeometry must be initialized and
 * pointsGeometry.getAttribute('customColor').needsUpdate == true
 *
 * @param {Integer} datasetIndex : index of point to change
 * @param {Vector3} colorRGB : a Vector3 of RGB values (0-1.0)
 */
function setPointColor(datasetIndex, colorRGB)
{
    pointsGeometry.getAttribute('customColor').array[datasetIndex] = colorRGB;
}

/**
 * Adjusts the size of a singular datapoint.
 *
 * @precondition pointsGeometry must be initialized and
 * pointsGeometry.getAttribute('size').needsUpdate == true
 *
 * @param {Integer} datasetIndex : index of point to change
 * @param {Number} size : New size for the point
 */
function setPointSize(datasetIndex, size)
{
    pointsGeometry.getAttribute('size').array[datasetIndex] = size;
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
