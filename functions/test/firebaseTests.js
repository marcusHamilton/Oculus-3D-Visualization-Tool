// var firebaseServer = require('firebase-server');
// var firebase = require('firebase');
// // const mainApp = require('./sampleTest');
// const assert = require('chai').assert;
//
// //Create Firebase server
// fbServer = new firebaseServer(5000, 'localhost.firebaseio.test', {
//     workers: {
//         tester: "Owen",
//         dev: "wynston"
//     }
// });
//
// /*
// fbServer.getValue().then(function(result) {
//   console.log(result);}, function(err) {
//   console.log('it fucked up'); // Error: "It broke"
// });
// */
//
// //fake api key and url of the locally hosted firebase database
// const config = {
//    apiKey: '12345',
//    databaseURL: 'ws://localhost.firebaseio.test:5000'
//  }
//
// var app = firebase.initializeApp(config, 'TestingEnvironment');
// console.log('local Firebase Initialized');
//
// var db = app.database();
//
// //write data to the test database
// function writeUserData(data) {
//   db.ref('/').set({
//     item: data
//   });
// }
// writeUserData('test data');
//
// //read all data from the database and print it
// return db.ref('/').once('value').then(function(snapshot) {
//   var data = (snapshot.val()) || 'Anonymous';
//   console.log(data);
// });
//
// // describe('mainApp', function(){
// // 	it('app should return hello', function(){
// // 		assert.equal();
// // 	});
// // });
// //
// // describe('manage3DWorld', function(){
// // 	it('should return hello', function(){
// // 		assert.equal();
// // 	});
// // });
//
// after(function(){
//   fbServer.close(console.log('server closed'));
// });
