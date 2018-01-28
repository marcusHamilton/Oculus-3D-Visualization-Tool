var FirebaseServer = require('firebase-server');
var Firebase = require('firebase');

fbServer = new FirebaseServer(5000, 'localhost.firebaseio.test', {
    workers: {
        tester: "Owen",
        dev: "wynston"
    }
});

fbServer.getValue().then(function(result) {
  console.log(result);}, function(err) {
  console.log('it fucked up'); // Error: "It broke"
});

const config = {
   apiKey: '12345',
   databaseURL: 'ws://localhost.firebaseio.test:5000'
 }
Firebase.initializeApp(config, 'TestingEnvironment');

after(function(){
  fbServer.close(console.log('server closed'));
});
