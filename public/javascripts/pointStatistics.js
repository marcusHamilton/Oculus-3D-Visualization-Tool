/**
 * Contains everything to do with statistical analysis of points within a world.
 * Most functions are simple wrappers that will call stats-lite library functions without having to directly use
 * the library.
 */
var stats = { meanX:0.0,
              meanY:0.0,
              meanZ:0.0,
              medianX:0.0,
              medianY:0.0,
              medianZ:0.0,
              modeX:0.0,
              modeY:0.0,
              modeZ:0.0,
              sumX:0.0,
              sumY:0.0,
              sumZ:0.0,
              varianceX:0.0,
              varianceY:0.0,
              varianceZ:0.0,
              standardDevX:0.0,
              standardDevY:0.0,
              standardDevZ:0.0
};

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

function calculateSelectionStats() {

  var xValues = [];
  var yValues = [];
  var zValues = [];
  if (selectedPoints.length != 0){
    for (var v = 0; v < selectedPoints.length; v++) {
      xValues.push(loadedDataset[selectedPoints[v]][loadedDataset[0][0]]);
      yValues.push(loadedDataset[selectedPoints[v]][loadedDataset[0][1]]);
      zValues.push(loadedDataset[selectedPoints[v]][loadedDataset[0][2]]);
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
    stats.sumY = statsSum(yValues);
    stats.sumZ = statsSum(zValues);
    stats.varianceX = statsVariance(xValues);
    stats.varianceY = statsVariance(yValues);
    stats.varianceZ = statsVariance(zValues);
    stats.standardDevX = statsStdev(xValues);
    stats.standardDevY = statsStdev(yValues);
    stats.standardDevZ = statsStdev(zValues);
  }
    console.log("Selection Statistics:");
    console.log(stats);

}

function drawSelectionStats(){

    calculateSelectionStats();

    var existingLabels = scene.getObjectByName("statsLabels");
    if (existingLabels){
      scene.remove(existingLabels);
    }

    statsLabelGroup = new THREE.Group();
    // Title
    drawTextLabel("Selection Statistics:", 0.1, new THREE.Color(.9,.9,.9), new THREE.Vector3(0,.02,0), statsLabelGroup);

    // Selected Column Names
    drawTextLabel(loadedDataset[1][loadedDataset[0][0]], 0.1, new THREE.Color(.7,0,0), new THREE.Vector3(.7,-.12,0), statsLabelGroup);
    drawTextLabel(loadedDataset[1][loadedDataset[0][1]], 0.1, new THREE.Color(0,.7,0), new THREE.Vector3(2.3,-.12,0), statsLabelGroup);
    drawTextLabel(loadedDataset[1][loadedDataset[0][2]], 0.1, new THREE.Color(0,0,.7), new THREE.Vector3(3.9,-.12,0), statsLabelGroup);


    // Stats row names
    drawTextLabel("Mean: ", 0.1, new THREE.Color(.7,.7,.7), new THREE.Vector3(0,-.24,0), statsLabelGroup);
    drawTextLabel("Median: ", 0.1, new THREE.Color(.7,.7,.7), new THREE.Vector3(0,-.36,0), statsLabelGroup);
    drawTextLabel("Mode: ", 0.1, new THREE.Color(.7,.7,.7), new THREE.Vector3(0,-.48,0), statsLabelGroup);
    drawTextLabel("Sum: ", 0.1, new THREE.Color(.7,.7,.7), new THREE.Vector3(0,-.60,0), statsLabelGroup);
    drawTextLabel("Variance: ", 0.1, new THREE.Color(.7,.7,.7), new THREE.Vector3(0,-.72,0), statsLabelGroup);
    drawTextLabel("Std. Dev.: ", 0.1, new THREE.Color(.7,.7,.7), new THREE.Vector3(0,-.84,0), statsLabelGroup);

    // X column stats
    drawTextLabel(stats.meanX, 0.1, new THREE.Color(.7,0,0), new THREE.Vector3(.7,-.24,0), statsLabelGroup);
    drawTextLabel(stats.medianX, 0.1, new THREE.Color(.7,0,0), new THREE.Vector3(.7,-.36,0), statsLabelGroup);
    drawTextLabel(stats.modeX, 0.1, new THREE.Color(.7,0,0), new THREE.Vector3(.7,-.48,0), statsLabelGroup);
    drawTextLabel(stats.sumX, 0.1, new THREE.Color(.7,0,0), new THREE.Vector3(.7,-.60,0), statsLabelGroup);
    drawTextLabel(stats.varianceX, 0.1, new THREE.Color(.7,0,0), new THREE.Vector3(.7,-.72,0), statsLabelGroup);
    drawTextLabel(stats.standardDevX, 0.1, new THREE.Color(.7,0,0), new THREE.Vector3(.7,-.84,0), statsLabelGroup);

    // Y column stats
    drawTextLabel(stats.meanY, 0.1, new THREE.Color(0,.7,0), new THREE.Vector3(2.3,-.24,0), statsLabelGroup);
    drawTextLabel(stats.medianY, 0.1, new THREE.Color(0,.7,0), new THREE.Vector3(2.3,-.36,0), statsLabelGroup);
    drawTextLabel(stats.modeY, 0.1, new THREE.Color(0,.7,0), new THREE.Vector3(2.3,-.48,0), statsLabelGroup);
    drawTextLabel(stats.sumY, 0.1, new THREE.Color(0,.7,0), new THREE.Vector3(2.3,-.60,0), statsLabelGroup);
    drawTextLabel(stats.varianceY, 0.1, new THREE.Color(0,.7,0), new THREE.Vector3(2.3,-.72,0), statsLabelGroup);
    drawTextLabel(stats.standardDevY, 0.1, new THREE.Color(0,.7,0), new THREE.Vector3(2.3,-.84,0), statsLabelGroup);

    // Z column stats
    drawTextLabel(stats.meanZ, 0.1, new THREE.Color(0,0,.7), new THREE.Vector3(3.9,-.24,0), statsLabelGroup);
    drawTextLabel(stats.medianZ, 0.1, new THREE.Color(0,0,.7), new THREE.Vector3(3.9,-.36,0), statsLabelGroup);
    drawTextLabel(stats.modeZ, 0.1, new THREE.Color(0,0,.7), new THREE.Vector3(3.9,-.48,0), statsLabelGroup);
    drawTextLabel(stats.sumZ, 0.1, new THREE.Color(0,0,.7), new THREE.Vector3(3.9,-.60,0), statsLabelGroup);
    drawTextLabel(stats.varianceZ, 0.1, new THREE.Color(0,0,.7), new THREE.Vector3(3.9,-.72,0), statsLabelGroup);
    drawTextLabel(stats.standardDevZ, 0.1, new THREE.Color(0,0,.7), new THREE.Vector3(3.9,-.84,0), statsLabelGroup);

    statsLabelGroup.position.x = -4;
    statsLabelGroup.position.y = 1;
    statsLabelGroup.position.z = -1;
    statsLabelGroup.name = "statsLabels";

    scene.add(statsLabelGroup);
}

function drawSinglePointXYZValues(pointIndex){

    var existingLabels = scene.getObjectByName("singlePointValues");
    if (existingLabels){
      scene.remove(existingLabels);
    }

    var singlePointValueLabels = new THREE.Group();
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

    drawTextLabel(loadedDataset[1][loadedDataset[0][0]] + " = " + pointValues.x, 0.1, new THREE.Color(0.7,0,0), new THREE.Vector3(pointPosition.x,pointPosition.y + .12,pointPosition.z), singlePointValueLabels);
    drawTextLabel(loadedDataset[1][loadedDataset[0][1]] + " = " + pointValues.y, 0.1, new THREE.Color(0,0.7,0), new THREE.Vector3(pointPosition.x,pointPosition.y,pointPosition.z), singlePointValueLabels);
    drawTextLabel(loadedDataset[1][loadedDataset[0][2]] + " = " + pointValues.z, 0.1, new THREE.Color(0,0,0.7), new THREE.Vector3(pointPosition.x,pointPosition.y - .12,pointPosition.z), singlePointValueLabels);
    */
    drawTextLabel(loadedDataset[1][loadedDataset[0][0]] + " = " + pointValues.x, 0.1, new THREE.Color(0.7,0,0), new THREE.Vector3(0,0,0), singlePointValueLabels);
    drawTextLabel(loadedDataset[1][loadedDataset[0][1]] + " = " + pointValues.y, 0.1, new THREE.Color(0,0.7,0), new THREE.Vector3(0,-.12,0), singlePointValueLabels);
    drawTextLabel(loadedDataset[1][loadedDataset[0][2]] + " = " + pointValues.z, 0.1, new THREE.Color(0,0,0.7), new THREE.Vector3(0,-.24,0), singlePointValueLabels);

    singlePointValueLabels.position.x = -4;
    singlePointValueLabels.position.y = -1;
    singlePointValueLabels.position.z = -1;
    singlePointValueLabels.name = "singlePointValues";

    scene.add(singlePointValueLabels);
}


