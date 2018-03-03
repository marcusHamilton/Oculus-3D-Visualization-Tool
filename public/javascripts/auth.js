// Initialize Firebase
var config = {
	apiKey: "AIzaSyBqX2igua_Vqc3QMh9vESrIWwv3jjY9AhU",
	authDomain: "oculus-3d-visualization-c5687.firebaseapp.com",
	databaseURL: "https://oculus-3d-visualization-c5687.firebaseio.com",
	projectId: "oculus-3d-visualization-c5687",
	storageBucket: "oculus-3d-visualization-c5687.appspot.com",
	messagingSenderId: "483800110325"
};
firebase.initializeApp(config);

//Database reference
var database = firebase.database();

//Google Users profile
var profile;

//Checks Auth state and adds the authenticated user to the database if they aren't already
firebase.auth().onAuthStateChanged( user => {
  if (user){
    this.userId = user.uid;
    userExistsDB(user.uid);
  }
});

function renderButton() {
  gapi.signin2.render('gSignIn', {
      'scope': 'profile email',
      'width': 100,
      'height': 30,
      'theme': 'dark',
      'onsuccess': signInSuccess,
      'onfailure': signInFailure
  });
}

function signInSuccess(googleUser) {
  console.log('Google Auth Response', googleUser);
	profile = googleUser.getBasicProfile();

  var profileHTML = '<img class="img-circle" id="profilePicture" src="' + profile.getImageUrl() +'"><button class="btn btn-primary btn-sm" onclick="signOut();"><span class="glyphicon glyphicon-log-out"></span> Sign out</button>';
  $('#gSignIn').hide();
  $('.userContent').html(profileHTML);

  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
  		//Build Firebase credential with the Google ID token.
  		var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);

  		// Sign in with credential from the Google user.
  		firebase.auth().signInWithCredential(credential).then(function(result) {
        // userExistsDB(firebaseUser.uid);
      });
      console.log("Signed " + profile.getName() + " into Firebase.");
    } else {
      console.log(profile.getName() + ' is already signed-in to Firebase.');
    }
  });
}

//Sign in failure
function signInFailure(msg) {
  console.error(msg);
}

//Signs user out of Firebase and Google oAuth
function signOut(){
  firebase.auth().signOut().then(function() {
    //Firebase Sign-out successful.

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      $('.userContent').html('');
      $('#gSignIn').fadeIn('slow');

      //Google Sign-out successful
      console.log('Signed-out ' + profile.getName() + '.');
    });
  }).catch(function(error) {
    // An error happened.
    console.error(error);
  });
}

// Prevents re-authentication from occuring
function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

//Checks whether the user has been created in the database or not
function userExistsDB(firebaseUID){
  database.ref("users/" + firebaseUID).once("value",snapshot => {
    const userData = snapshot.val();
    if (userData){
      //User exists in database already
    }
    else{
      //Add user to the database
      createUserDB(firebaseUID);
    }
  });
}

//Add the newly authenticated user to the database
function createUserDB(firebaseUID){
  database.ref('users/' + firebaseUID).set({
    fullName: profile.getName(),
    givenName: profile.getGivenName(),
    familyName: profile.getFamilyName(),
    email: profile.getEmail(),
    profile_picture : profile.getImageUrl()
  });
  console.log("Success: Added " + profile.getName() + " as an authenticated user to the database.");
}

//******************************************************************************
//                          DATABASE functions
//******************************************************************************

//Read World
//Input: the world id (string)
//Returns: the world contents as json
function readWorld(worldId){
	var firebaseWorld;
  return database.ref('worlds/'+worldId).once('value').then(function(snapshot){
		firebaseWorld = snapshot.val();
    var numGeom = firebaseWorld.geometries.length;

    for (var i=0; i<numGeom; i++){
      firebaseWorld.geometries[i].data["normals"] = [];
      firebaseWorld.geometries[i].data["faces"] = [];
    }
	}).then(function () {return firebaseWorld});
}

console.log(readWorld('-L6cciLgse7gqXZ62iLp'));


//Write World to Database
//Input: the world contents in json format
//Returns: unique id of world in the database
function writeWorld(jsonFile){
  var worldRef = firebase.database().ref('/').child("worlds").push(jsonFile);
	var worldRefKey = worldRef.key;
	return worldRefKey;
}


//You only need to call this function once and it will listen for changes.
//+	Whenever a geometry in the world changes, the contents of this function
//+	will be run.
//Input: current world id
//Returns: geometry object (json) that has changed in the database
function onGeometryDatabaseChange(worldId){
	var worldRef = firebase.database().ref('worlds/'+worldId+'/geometries');
	worldRef.on('child_changed', function(snapshot) {
	  console.log(snapshot.val());
		// UPDATE THE GEOMETRY IN THE SCENE
	  });
}


/*
When a geometry changes on the client side, this function needs to be called
in order to update the geometry in the database.
Input: worldId -> id of the world
			 geometryId -> id of the geometry
			 geometry -> the geometry in json format
Returns: geometry will be updated in the database
*/
function updateGeometryInDatabase(worldId, geometryId, geometry){
	var geometryRef = database.ref('worlds/'+worldId+'/'+geometryId);
	geometryRef.update(geometry);
}


/*
Query a worldInfo object by world id
Input: the id of the world
Returns: worldInfo json object with matching world id
*/
function getWorldInfo(worldId){
	var result;
	var worldInfoRef = database.ref('worldInfo');
	var queryRef = worldInfoRef.orderByChild("ID").equalTo(worldId);
	return queryRef.once('value').then(function(snapshot){
		result = snapshot.val();
	}).then(function() {return result});
}

//test getWorldInfo
// var worldId = '-L6UfQx0beRgpsbWxeNt';
// var result = getWorldInfo(worldId);
// console.log(result);

//******************************************************************************
//******************************************************************************
