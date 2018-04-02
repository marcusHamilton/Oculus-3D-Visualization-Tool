//DAT GUI variables
var redraw = {
  redraw: function () {
    redrawDataSet()
  },
  redrawVR: function () {
    redrawDataSetVR()
  }
}; //function for Redraw button in browser
var pushAxesToDB = {
  pushAxesToDB: function () {
    updateAxisSelectionInDatabase(worldID, selectedAxesJSON)
  }
};
var axisMenu;
//Interface between data and redraw function for broswer gui
var selectedAxes; //The Axes selected in the VR GUI

//Used for inspection to ensure that the object that is going to be passed is the correct format to be pushed to the database
var selectedAxesJSON;
var inspectAxesJSON;


/*Clears the scene and redraws data set
  Inputs:
    VR: if 0, calls the redraw function, getting the axes from the browser GUI
        if 1, calls the redraw function, getting the axes from the VR GUI

    Mocking:
      Refer to the axisMenu(BR/VR) functions for properties of each corresponding object

  Result:
    Dataset is redrawn based on the axis selection from the desired source (VR/BR)
*/
function redrawDataSetVR() {
	axisMenu.xAxis = axisMenu.axesOptions.indexOf(selectedAxes.selectedX);
    axisMenu.yAxis = axisMenu.axesOptions.indexOf(selectedAxes.selectedY);
    axisMenu.zAxis = axisMenu.axesOptions.indexOf(selectedAxes.selectedZ);
    if (axisMenu.xAxis >= 0 && axisMenu.yAxis >= 0 && axisMenu.zAxis >= 0) {
      //Console logs to validate selection from gui vs. what is being saved, both should be the same.
      console.log("X-Axis: " + axisMenu.xAxis + "|VR selected: " + axisMenu.axesOptions.indexOf(selectedAxes.selectedX));
      console.log("Y-Axis: " + axisMenu.yAxis + "|VR selected: " + axisMenu.axesOptions.indexOf(selectedAxes.selectedY));
      console.log("Z-Axis: " + axisMenu.zAxis + "|VR selected: " + axisMenu.axesOptions.indexOf(selectedAxes.selectedZ));

      // console.log("Removing children")
	  scene.remove(scene.getObjectByName("DatasetAxisGroup"));

      /*while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }*/
      // console.log("Redrawing Data");
      drawDataset(axisMenu.xAxis, axisMenu.yAxis, axisMenu.zAxis);
      drawAxisLabels();
    } else {
      console.log("DropDowns cannot be left blank. Please select an option per axis. Thank you.\n" +
        "If any are left blank no changes will occur in the drawn data set.");
    }
	
	selectedAxesJSON = {
      0: axisMenu.xAxis,
      1: axisMenu.yAxis,
      2: axisMenu.zAxis
    };
    inspectAxesJSON = JSON.stringify(selectedAxesJSON);
    console.log(inspectAxesJSON);
    selectedAxesJSON = JSON.parse(JSON.stringify(selectedAxesJSON));
  
    recolorSelected();
}

function redrawDataSet() {
	axisMenu.xAxis = folder.__controllers[1].__select.selectedIndex;
    axisMenu.yAxis = folder.__controllers[2].__select.selectedIndex;
    axisMenu.zAxis = folder.__controllers[3].__select.selectedIndex;

    //Console logs to validate selection from gui vs. what is being saved, both should be the same.
    console.log("X-Axis: " + axisMenu.xAxis + "|Browser selected: " + folder.__controllers[1].__select.selectedIndex);
    console.log("Y-Axis: " + axisMenu.yAxis + "|Browser selected: " + folder.__controllers[2].__select.selectedIndex);
    console.log("Z-Axis: " + axisMenu.zAxis + "|Browser selected: " + folder.__controllers[3].__select.selectedIndex);

    // console.log("Removing children")
    scene.remove(scene.findObjectByName("DatasetAxisGroup"));

    // console.log("Redrawing Data");
    drawDataset(axisMenu.xAxis, axisMenu.yAxis, axisMenu.zAxis);
    drawAxisLabels();
	
	selectedAxesJSON = {
      0: axisMenu.xAxis,
      1: axisMenu.yAxis,
      2: axisMenu.zAxis
    };
    inspectAxesJSON = JSON.stringify(selectedAxesJSON);
    console.log(inspectAxesJSON);
    selectedAxesJSON = JSON.parse(JSON.stringify(selectedAxesJSON));
  
    recolorSelected();
}

/*function redrawDataSet(VR) {
  if (VR === 0) {
    
  } else {
    
  }
  selectedAxesJSON = {
    0: axisMenu.xAxis,
    1: axisMenu.yAxis,
    2: axisMenu.zAxis
  };
  inspectAxesJSON = JSON.stringify(selectedAxesJSON);
  console.log(inspectAxesJSON);
  selectedAxesJSON = JSON.parse(JSON.stringify(selectedAxesJSON));
  
  recolorSelected();


}*/

/**
Constructor for an object that holds the currently selected axis values as well
as the array of labels to be displayed by the dropdowns
**/
function selectedAxes() {
  this.xAxis = loadedDataset[0][0]; //holds current x axis
  this.yAxis = loadedDataset[0][1]; //holds current y axis
  this.zAxis = loadedDataset[0][2]; //holds current z axis
  this.axesOptions = loadedDataset[1]; //hold the row of data containing axis labels
}

//Holds the selected axis choices for the VR GUI
function selectedAxesVR() {
  this.selectedX = loadedDataset[0][0];
  this.selectedY = loadedDataset[0][1];
  this.selectedZ = loadedDataset[0][2];
};