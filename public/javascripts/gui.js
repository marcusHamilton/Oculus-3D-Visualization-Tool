var VRGui;
var BRGui;
var folder; //BR GUI menu element
var pSizeSlider;

//Creates the VR gui object which contains a number of useful tools
function VRGui() {
  VRGui = new dat.GUIVR.create("Tools");

  //Point size slider
  var slider = VRGui.add(pointVars, 'plotPointSizeCoeff', 0.000, 0.5);
  slider.step(0.005);
  slider.listen(pointVars.plotPointSizeCoeff);
  slider.onChange(redraw.redrawVR);
  slider.name("Point Size");

  // //Dropdown for choosing X axis
  var xDrop = VRGui.add(selectedAxes, 'selectedX', axisMenu.axesOptions);

  // //Dropdown for choosing Y axis
  var yDrop = VRGui.add(selectedAxes, 'selectedY', axisMenu.axesOptions);

  // //Dropdown for choosing Z axis
  var zDrop = VRGui.add(selectedAxes, 'selectedZ', axisMenu.axesOptions);

  // //Button to redraw using redraw with a vr switch to trigger the axis data to come from the vr GUI
  VRGui.add(redraw, 'redrawVR');

  // //Button that pushes the currently drawn axis selection to the database
  var pushDB = VRGui.add(pushToDB, 'pushToDB');
  pushDB.name("Push Axis/Selection");
}

/**
  This populates the axis menu in the browser
  **/
function BRGui() {
  (function () {
    var script2 = document.createElement('script');
    script2.onload = function () {
      BRGui = new dat.GUI();
      BRGui.autoPlace = false;
      folder = BRGui.addFolder("axis");

      //Point size slider
      var slider = folder.add(pointVars, 'plotPointSizeCoeff', 0.000, 0.1, 0.001);
      slider.listen(pointVars.plotPointSizeCoeff);
      slider.__onChange = redraw.redraw;

      //Dropdown for choosing X axis
      var xSelect = folder.add(axisMenu, 'xAxis', axisMenu.axesOptions);

      //Dropdown for choosing Y axis
      var ySelect = folder.add(axisMenu, 'yAxis', axisMenu.axesOptions);

      //Dropdown for choosing Z axis
      var zSelect = folder.add(axisMenu, 'zAxis', axisMenu.axesOptions);

      folder.add(redraw, 'redraw');
      folder.add(pushAxesToDB, 'pushAxesToDB');

      //Initializes with the selection from the loaded dataset
      xSelect.__select.selectedIndex = axisMenu.xAxis;
      ySelect.__select.selectedIndex = axisMenu.yAxis;
      zSelect.__select.selectedIndex = axisMenu.zAxis;
    };
    script2.src = '//rawgit.com/dataarts/dat.gui/master/build/dat.gui.js';
    document.head.appendChild(script2);
  })();
}