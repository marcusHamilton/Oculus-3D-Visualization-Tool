// var firebaseServer = require('firebase-server');
var firebase = require('firebase');

//Create Firebase server
// fbServer = new firebaseServer(5000, 'localhost.firebaseio.test', {
//     workers: {
//         tester: "Owen",
//         dev: "wynston"
//     }
// });

/*
fbServer.getValue().then(function(result) {
  console.log(result);}, function(err) {
  console.log('it fucked up'); // Error: "It broke"
});
*/

// //fake api key and url of the locally hosted firebase database
// const config = {
//    apiKey: 'AIzaSyBqX2igua_Vqc3QMh9vESrIWwv3jjY9AhU',
//    databaseURL: 'localhost:5000'
//  }

// // Set the configuration for your app
var config = {
  apiKey: "AIzaSyBqX2igua_Vqc3QMh9vESrIWwv3jjY9AhU",
  authDomain: "oculus-3d-visualization-c5687.firebaseapp.com",
  databaseURL: "https://oculus-3d-visualization-c5687.firebaseio.com",
  projectId: "oculus-3d-visualization-c5687",
  storageBucket: "oculus-3d-visualization-c5687.appspot.com",
  messagingSenderId: "483800110325"
};
firebase.initializeApp(config);

console.log('Connected to firebase server');

// Get a reference to the database service
var db = firebase.database();

//write data to the test database
function writeUserData(data) {
  db.ref('/').set({
    item: data
  });
}
console.log('writing to database');
writeUserData('pls dont end up in production db');

//read all data from the database and print it
console.log('reading all data...');
return db.ref('/').once('value').then(function(snapshot) {
  var data = (snapshot.val()) || 'Anonymous';
  console.log(data);
});
