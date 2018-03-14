var functions = require('firebase-functions');
var firebase = require('firebase-admin');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engines = require('consolidate');
var index = require('./routes/index');
var features = require('./routes/features');
var about = require('./routes/about');
var VRWorld = require('./routes/VRWorld');
var dashboard = require('./routes/dashboard');

var app = express();

// view engine setup
app.engine('ejs', engines.ejs);
app.set('views', './views');
app.set('view engine', 'ejs');

// Firebase set-up
var serviceAccount = require("./config/oculus-3d-visualization-c5687-firebase-adminsdk-wj48z-a692b7b893.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  apiKey: "AIzaSyBqX2igua_Vqc3QMh9vESrIWwv3jjY9AhU",
  authDomain: "oculus-3d-visualization-c5687.firebaseapp.com",
  databaseURL: "https://oculus-3d-visualization-c5687.firebaseio.com",
  projectId: "oculus-3d-visualization-c5687",
  storageBucket: "oculus-3d-visualization-c5687.appspot.com",
  messagingSenderId: "483800110325"
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static('config/favicon.ico'));

//CREATE a world
app.post("/uploadWorld", function (req, res){
  var worldsRef = firebase.database().ref("/").child("worlds");
  var worldData = req.body;
  var newWorldRef = worldsRef.push(worldData);
  var newWorldId = newWorldRef.key;
  res.send(newWorldId);
});

// //TODO
//CREATE a user
// app.post("/createUser", function (req, res){
//   res.send('TODO');
// });

//GET all world ids
app.get("/worlds", function(req, res){
  firebase.database().ref('/worlds').once('value').then(function(snapshot) {
    var keys = [];
    snapshot.forEach(function(childSnapshot){
      keys.push(childSnapshot.key)
    });
    res.send(keys);
  });
});

//GET a world
app.get("/worlds/:id", function(req, res){
  worldId = req.params.id;
  var uid = null;
  //Verify user token
  // admin.auth().verifyIdToken(idToken)
  // .then(function(decodedToken) {
  //   var uid = decodedToken.uid;
  // }).catch(function(error) {
  // });

  firebase.database().ref('/worlds/' + worldId).once('value').then(function(snapshot) {
    // res.send(snapshot.val());
    var firebaseWorld = snapshot.val();
    var numGeom = firebaseWorld.geometries.length;

    for (var i=0; i<numGeom; i++){
      firebaseWorld.geometries[i].data["normals"] = [];
      firebaseWorld.geometries[i].data["faces"] = [];
    }
    res.send(firebaseWorld);
  });
});

//DELETE a world
app.delete("/worlds/:id", function(req, res){
  worldId = req.params.id;

  //Verify user token
  // admin.auth().verifyIdToken(idToken)
  // .then(function(decodedToken) {
  //   var uid = decodedToken.uid;
  // }).catch(function(error) {
  // });

  firebase.database().ref('/worlds/' + worldId).remove().then(function(){
    res.redirect("/");
  });
});

//TODO
//UPDATE a world
app.put("/worlds/:id", function(req, res){
  worldId = req.params.id;
  var worldData = req.body;

  //Verify user token
  // admin.auth().verifyIdToken(idToken)
  // .then(function(decodedToken) {
  //   var uid = decodedToken.uid;
  // }).catch(function(error) {
  // });

  ref = firebase.database().ref("/worlds").child(worldId);
  ref.update(worldData);
  res.send({"status": 'success',
            "worldId": worldId});
});

app.use('/', index);
app.use('/features', features);
app.use('/about', about);
app.use('/VRWorld', VRWorld);
app.use('/dashboard', dashboard);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports.app = functions.https.onRequest(app);

module.exports.hello = function hello() {
  return 'hello';
}
