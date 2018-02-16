/*
 *This JS file is responsible for the creation of a new 3d world.
 *It will take in a CSV file and in turn create a threejs world that contains the
 *CSV files data points. This will export a JSON file containing the scene.
 */

/*First step, handle the CSV dataset*/

//Global variable for storing the csv data
var parsedData;

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
  var XAxis = $('#x-axis').select2('data');
  var YAxis = $('#y-axis').select2('data');
  var ZAxis = $('#z-axis').select2('data');
  console.log(XAxis);
  //Remove the objects
  XAxis = XAxis[0].id;
  YAxis = YAxis[0].id;
  ZAxis = ZAxis[0].id;

  //Pack for storage
  var AxisValues = [XAxis, YAxis, ZAxis];
  console.log(XAxis);

}
