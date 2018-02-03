/**
 * Temporary assertion because I don't know how to work node.js
 * @param condition {bool} assertion
 * @param message {String} Failure message
 */
function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}
/**
 * Draws a 3D point-field/scatterplot graph representation of the input
 * dataset with reasonable initial scaling.
 *
 * @precondition The CSV must be parsed so that parsedData != null
 *
 * @param {Integer} x CSV column index for the x-axis
 * @param {Integer} y CSV column index for the y-axis
 * @param {Integer} z CSV column index for the z-axis
 *
 * @return 0 on success (Might change this to the mesh object itself).
 */
function drawDataset(xCol, yCol, zCol)
{
  assert(parsedData, 'parsedData must be defined for drawDataset()');
  assert(xCol >= 0 && Number.isInteger(xCol),
    'drawDataset() xCol value must be a positive integer');
  assert(yCol >= 0 && Number.isInteger(yCol),
    'drawDataset() yCol value must be a positive integer');
  assert(zCol >= 0 && Number.isInteger(zCol),
    'drawDataset() zCol value must be a positive integer');

  var largestX = 0;
  var largestY = 0;
  var largestZ = 0;
  var largestEntry = 0;

  for (var i = 0; i < parsedData.length; i++) {

    // Find the largest Entry, X, Y, and Z value ceilings in the data.
    if (parsedData[i][0] > largestX) {
        largestX = parsedData[i][xCol];
    }
    if (parsedData[i][1] > largestY) {
        largestY = parsedData[i][yCol];
    }
    if (parsedData[i][2] > largestZ) {
        largestZ = parsedData[i][zCol];
    }
    largestEntry = Math.max(largestX, largestY, largestZ);

  }


}