/**
 * Contains everything to do with statistical analysis of points within a world.
 * Most functions are simple wrappers that will call stats-lite library functions without having to directly use
 * the library.
 */
// An object to hold all computed values.
function Stats(){ 
              this.meanX=0.0;
              this.meanY =0.0;
              this.meanZ=0.0;
              this.medianX=0.0;
              this.medianY=0.0;
              this.medianZ=0.0;
              this.modeX=0.0;
              this.modeY=0.0;
              this.modeZ=0.0;
              this.sumX=0.0;
              this.sumY=0.0;
              this.sumZ=0.0;
              this.varianceX=0.0;
              this.varianceY=0.0;
              this.varianceZ=0.0;
              this.standardDevX=0.0;
              this.standardDevY=0.0;
              this.standardDevZ=0.0;
}

var stats = new Stats();
/**
 * Wrappers for jStats library functions
 */
var statsLabelGroup;
function statsMean(pointValues){
    return jStat.mean(pointValues);
}
function statsSum(pointValues){
    return jStat.sum(pointValues);
}
function statsMedian(pointValues){
    return jStat.median(pointValues);
}
function statsMode(pointValues){
    return jStat.mode(pointValues);
}
function statsVariance(pointValues){
    return jStat.variance(pointValues);
}
function statsStdev(pointValues){
    return jStat.stdev(pointValues);
}
function statsHistogram(pointValues){
    return jStat.histogram(pointValues);
}

/**
 * Compute all the stats values
 */
function calculateSelectionStats() {
  var xValues = [];
  var yValues = [];
  var zValues = [];
  if (selectedPoints.length != 0){
    for (var v = 0; v < selectedPoints.length; v++) {
      xValues.push(loadedDataset[selectedPoints[v]][axisMenu.xAxis]);
      yValues.push(loadedDataset[selectedPoints[v]][axisMenu.yAxis]);
      zValues.push(loadedDataset[selectedPoints[v]][axisMenu.zAxis]);
    }
    stats.meanX = statsMean(xValues);
    stats.meanY = statsMean(yValues);
    stats.meanZ = statsMean(zValues);
    stats.medianX = statsMedian(xValues);
    stats.medianY = statsMedian(yValues);
    stats.medianZ = statsMedian(zValues);
    stats.modeX = statsMode(xValues)[0];
    stats.modeY = statsMode(yValues)[0];
    stats.modeZ = statsMode(zValues)[0];
    stats.sumX = statsSum(xValues);
	console.log(xValues);
    stats.sumY = statsSum(yValues);
    stats.sumZ = statsSum(zValues);
    stats.varianceX = statsVariance(xValues);
    stats.varianceY = statsVariance(yValues);
    stats.varianceZ = statsVariance(zValues);
    stats.standardDevX = statsStdev(xValues);
    stats.standardDevY = statsStdev(yValues);
    stats.standardDevZ = statsStdev(zValues);
	
  }
  else{
	stats = new Stats();
  }
    console.log("Selection Statistics:");
    console.log(stats);
}

/**
 * Populate a group of 3D text labels with the computed stats values
 * and add them to the scene.
 */
function drawSelectionStats(){
    //if(statsLabelGroup != null && statsLabelGroup.children[1].geometry.parameters.text === axisMenu.axesOptions[loadedDataset[0][0]]
    //  && statsLabelGroup.children[2].geometry.parameters.text === axisMenu.axesOptions[loadedDataset[0][1]]
     // && statsLabelGroup.children[3].geometry.parameters.text === axisMenu.axesOptions[loadedDataset[0][2]]){
    //  return;
    //}

    //measuring execution time for calculate
    calculateSelectionStats();

    // Clear any existing labels
    var existingLabels = scene.getObjectByName("statsLabels");
    if (existingLabels){
      scene.remove(existingLabels);
    }

    statsLabelGroup = new THREE.Group();

    // Title
    drawTextLabel("Selection Statistics:", 0.1, new THREE.Color(.9,.9,.9),
      new THREE.Vector3(-.12,.02,0), statsLabelGroup);

    // Selected Column Names
    drawTextLabel(loadedDataset[1][axisMenu.xAxis], 0.1,
      new THREE.Color(.7,0,0), new THREE.Vector3(.58,-.12,0), statsLabelGroup);
    drawTextLabel(loadedDataset[1][axisMenu.yAxis], 0.1,
      new THREE.Color(0,.7,0), new THREE.Vector3(2.18,-.12,0), statsLabelGroup);
    drawTextLabel(loadedDataset[1][axisMenu.zAxis], 0.1,
      new THREE.Color(0,.2,1), new THREE.Vector3(3.77,-.12,0), statsLabelGroup);

    // Stats row names
    drawTextLabel("Mean: " + "\n" +
                  "Median: " + "\n" +
                  "Mode: " + "\n" +
                  "Sum: " + "\n" +
                  "Variance: " + "\n" +
                  "Std. Dev.: ",
                  0.1, 
                  new THREE.Color(.7,.7,.7), 
                  new THREE.Vector3(-.12,-.24,0),
                  statsLabelGroup
                  );

    // X column stats
    drawTextLabel(stats.meanX  + "\n" +
                  stats.medianX + "\n" +
                  stats.modeX + "\n" +
                  stats.sumX + "\n" +
                  stats.varianceX + "\n" +
                  stats.standardDevX,
                  0.1,
                  new THREE.Color(.7,0,0),
                  new THREE.Vector3(.58,-.24,0),
                  statsLabelGroup
                  );

    // Y column stats

    drawTextLabel(stats.meanY  + "\n" +
                  stats.medianY + "\n" +
                  stats.modeY + "\n" +
                  stats.sumY + "\n" +
                  stats.varianceY + "\n" +
                  stats.standardDevY,
                  0.1,
                  new THREE.Color(0,.7,0),
                  new THREE.Vector3(2.18,-.24,0),
                  statsLabelGroup
                  );

    // Z column stats

       drawTextLabel(stats.meanZ  + "\n" +
                  stats.medianZ + "\n" +
                  stats.modeZ + "\n" +
                  stats.sumZ + "\n" +
                  stats.varianceZ + "\n" +
                  stats.standardDev,
                  0.1,
                  new THREE.Color(0,.2,1),
                  new THREE.Vector3(3.77,-.24,0),
                  statsLabelGroup
                  );

    // Set initial position of the group
    statsLabelGroup.position.x = -5;
    statsLabelGroup.position.y = 1;
    statsLabelGroup.position.z = 1;
	  statsLabelGroup.rotation.y += Math.PI/4;
    statsLabelGroup.name = "statsLabels";

    scene.add(statsLabelGroup);
}

/**
 * Populates a group of 3D text meshes with the values of the columns
 * represented by the last selected point.
 * @param pointIndex : The index of the point for which to display its fields.
 */
function drawSinglePointXYZValues(pointIndex){

    // Clear any existing labels
    var existingLabels = scene.getObjectByName("singlePointValues");
    if (existingLabels){
      scene.remove(existingLabels);
    }

    var singlePointValueLabels = new THREE.Group();

    // Get the actual parsed Data for the point at pointIndex
    var pointValues = new THREE.Vector3(
      loadedDataset[pointIndex][loadedDataset[0][0]],
      loadedDataset[pointIndex][loadedDataset[0][1]],
      loadedDataset[pointIndex][loadedDataset[0][2]]
    );

    /*
    var pointPosition = new THREE.Vector3(
      pointsGeometry.getAttribute('position').array[(pointIndex * 3)],
      pointsGeometry.getAttribute('position').array[(pointIndex * 3)+1],
      pointsGeometry.getAttribute('position').array[(pointIndex * 3)+2]
    )
    drawTextLabel(loadedDataset[1][loadedDataset[0][0]] + " = " + pointValues.x,
    0.1, new THREE.Color(0.7,0,0),
    new THREE.Vector3(pointPosition.x,pointPosition.y + .12,pointPosition.z),
    singlePointValueLabels);
    drawTextLabel(loadedDataset[1][loadedDataset[0][1]] + " = " + pointValues.y,
    0.1, new THREE.Color(0,0.7,0),
    new THREE.Vector3(pointPosition.x,pointPosition.y,pointPosition.z),
    singlePointValueLabels);
    drawTextLabel(loadedDataset[1][loadedDataset[0][2]] + " = " + pointValues.z,
    0.1, new THREE.Color(0,0,0.7),
    new THREE.Vector3(pointPosition.x,pointPosition.y - .12,pointPosition.z),
    singlePointValueLabels);
    */

    drawTextLabel(loadedDataset[1][loadedDataset[0][0]] + " = " + pointValues.x + "\n" +
				  loadedDataset[1][loadedDataset[0][1]] + " = " + pointValues.y + "\n" +
				  loadedDataset[1][loadedDataset[0][2]] + " = " + pointValues.z + "\n",
      0.1, new THREE.Color(0.7,0,0), new THREE.Vector3(0,0,0),
      singlePointValueLabels);

    // Set initial position for the group.
    singlePointValueLabels.position.x = -4;
    singlePointValueLabels.position.y = -1;
    singlePointValueLabels.position.z = -1;

    singlePointValueLabels.name = "singlePointValues";

    scene.add(singlePointValueLabels);
}


function drawSelectionStatsVerbose(){
  /*if(statsLabelGroup != null && statsLabelGroup.children[1].geometry.parameters.text === axisMenu.axesOptions[loadedDataset[0][0]]
        && statsLabelGroup.children[2].geometry.parameters.text === axisMenu.axesOptions[loadedDataset[0][1]]
        && statsLabelGroup.children[3].geometry.parameters.text === axisMenu.axesOptions[loadedDataset[0][2]]){
        return;
      }
*/
      //measuring execution time for calculate
      calculateSelectionStats();
      var t1 = performance.now();

      // Clear any existing labels
      var existingLabels = scene.getObjectByName("statsLabels");
      if (existingLabels){
        scene.remove(existingLabels);
      }
      var t2 = performance.now();
      statsLabelGroup = new THREE.Group();

      // Title
      drawTextLabel("Selection Statistics:", 0.1, new THREE.Color(.9,.9,.9),
        new THREE.Vector3(0,.02,0), statsLabelGroup);

      // Selected Column Names
      drawTextLabel(loadedDataset[1][loadedDataset[0][0]], 0.1,
        new THREE.Color(.7,0,0), new THREE.Vector3(.7,-.12,0), statsLabelGroup);
      drawTextLabel(loadedDataset[1][loadedDataset[0][1]], 0.1,
        new THREE.Color(0,.7,0), new THREE.Vector3(2.3,-.12,0), statsLabelGroup);
      drawTextLabel(loadedDataset[1][loadedDataset[0][2]], 0.1,
        new THREE.Color(0,0,.7), new THREE.Vector3(3.9,-.12,0), statsLabelGroup);

      var t3 = performance.now();
      // Stats row names
      drawTextLabel("Mean: ", 0.1, new THREE.Color(.7,.7,.7),
        new THREE.Vector3(0,-.24,0), statsLabelGroup);
      drawTextLabel("Median: ", 0.1, new THREE.Color(.7,.7,.7),
        new THREE.Vector3(0,-.36,0), statsLabelGroup);
      drawTextLabel("Mode: ", 0.1, new THREE.Color(.7,.7,.7),
        new THREE.Vector3(0,-.48,0), statsLabelGroup);
      drawTextLabel("Sum: ", 0.1, new THREE.Color(.7,.7,.7),
        new THREE.Vector3(0,-.60,0), statsLabelGroup);
      drawTextLabel("Variance: ", 0.1, new THREE.Color(.7,.7,.7),
        new THREE.Vector3(0,-.72,0), statsLabelGroup);
      drawTextLabel("Std. Dev.: ", 0.1, new THREE.Color(.7,.7,.7),
        new THREE.Vector3(0,-.84,0), statsLabelGroup);

      var t4 = performance.now();
      // X column stats
      drawTextLabel(stats.meanX, 0.1, new THREE.Color(.7,0,0),
        new THREE.Vector3(.7,-.24,0), statsLabelGroup);
      drawTextLabel(stats.medianX, 0.1, new THREE.Color(.7,0,0),
        new THREE.Vector3(.7,-.36,0), statsLabelGroup);
      drawTextLabel(stats.modeX, 0.1, new THREE.Color(.7,0,0),
        new THREE.Vector3(.7,-.48,0), statsLabelGroup);
      drawTextLabel(stats.sumX, 0.1, new THREE.Color(.7,0,0),
        new THREE.Vector3(.7,-.60,0), statsLabelGroup);
      drawTextLabel(stats.varianceX, 0.1, new THREE.Color(.7,0,0),
        new THREE.Vector3(.7,-.72,0), statsLabelGroup);
      drawTextLabel(stats.standardDevX, 0.1, new THREE.Color(.7,0,0),
        new THREE.Vector3(.7,-.84,0), statsLabelGroup);

      var t5 = performance.now();
      // Y column stats
      drawTextLabel(stats.meanY, 0.1, new THREE.Color(0,.7,0),
        new THREE.Vector3(2.3,-.24,0), statsLabelGroup);
      drawTextLabel(stats.medianY, 0.1, new THREE.Color(0,.7,0),
        new THREE.Vector3(2.3,-.36,0), statsLabelGroup);
      drawTextLabel(stats.modeY, 0.1, new THREE.Color(0,.7,0),
        new THREE.Vector3(2.3,-.48,0), statsLabelGroup);
      drawTextLabel(stats.sumY, 0.1, new THREE.Color(0,.7,0),
        new THREE.Vector3(2.3,-.60,0), statsLabelGroup);
      drawTextLabel(stats.varianceY, 0.1, new THREE.Color(0,.7,0),
        new THREE.Vector3(2.3,-.72,0), statsLabelGroup);
      drawTextLabel(stats.standardDevY, 0.1, new THREE.Color(0,.7,0),
        new THREE.Vector3(2.3,-.84,0), statsLabelGroup);

      var t6 = performance.now();
      // Z column stats
      drawTextLabel(stats.meanZ, 0.1, new THREE.Color(0,0,.7),
        new THREE.Vector3(3.9,-.24,0), statsLabelGroup);
      drawTextLabel(stats.medianZ, 0.1, new THREE.Color(0,0,.7),
        new THREE.Vector3(3.9,-.36,0), statsLabelGroup);
      drawTextLabel(stats.modeZ, 0.1, new THREE.Color(0,0,.7),
        new THREE.Vector3(3.9,-.48,0), statsLabelGroup);
      drawTextLabel(stats.sumZ, 0.1, new THREE.Color(0,0,.7),
        new THREE.Vector3(3.9,-.60,0), statsLabelGroup);
      drawTextLabel(stats.varianceZ, 0.1, new THREE.Color(0,0,.7),
        new THREE.Vector3(3.9,-.72,0), statsLabelGroup);
      drawTextLabel(stats.standardDevZ, 0.1, new THREE.Color(0,0,.7),
        new THREE.Vector3(3.9,-.84,0), statsLabelGroup);

      var t7 = performance.now();
      // Set initial position of the group
      statsLabelGroup.position.x = -5;
      statsLabelGroup.position.y = 1;
      statsLabelGroup.position.z = 1;
      statsLabelGroup.rotation.y += Math.PI/4;
      statsLabelGroup.name = "statsLabels";

      scene.add(statsLabelGroup);
      var t8 = performance.now();
      console.log("Execution of drawSelectionStats took: " + (t8-t1) + " ms" + '\n' +
      'Part 1: ' + (t2-t1) + '\n' +
      'Part 2: ' + (t3-t2) + '\n' +
      'Part 3: ' + (t4-t3) + '\n' +
      'Part 4: ' + (t5-t4) + '\n' +
      'Part 5: ' + (t6-t5) + '\n' +
      'Part 6: ' + (t7-t6) + '\n' +
      'Part 7: ' + (t8-t7)
       );
}