// Initialize Firebase
var profile;
var config = {
	apiKey: "AIzaSyBqX2igua_Vqc3QMh9vESrIWwv3jjY9AhU",
	authDomain: "oculus-3d-visualization-c5687.firebaseapp.com",
	databaseURL: "https://oculus-3d-visualization-c5687.firebaseio.com",
	projectId: "oculus-3d-visualization-c5687",
	storageBucket: "oculus-3d-visualization-c5687.appspot.com",
	messagingSenderId: "483800110325"
};
firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();

// // //Force user to sign in
// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // User is signed in.
//   } else {
//   	firebase.auth().signInWithRedirect(provider);
//   }
// });

//******************************************************************************
//                          DATABASE functions
//******************************************************************************

var database = firebase.database();


//Read World
//Input: the world id (string)
//Returns: the world contents as json
function readWorld(worldId){
  database.ref('worlds/'+worldId).once('value').then(function(snapshot){
		var firebaseWorld = snapshot.val();
    var numGeom = firebaseWorld.geometries.length;

    for (var i=0; i<numGeom; i++){
      firebaseWorld.geometries[i].data["normals"] = [];
      firebaseWorld.geometries[i].data["faces"] = [];
    }
    return firebaseWorld;
	})
}


//Write World to Database
//Input: the world contents in json format
//Returns: unique id of world in the database
function writeWorld(jsonFile){
  var worldRef = firebase.database().ref('/worlds').push(jsonFile);
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
	var worldInfoRef = database.ref('/worldInfo');
	var queryRef = worldInfoRef.orderByChild("ID").equalTo(worldId);
	var worldInfo = null;
	queryRef.once('value').then(function(snapshot){
		worldInfo = snapshot;
	});
	return worldInfo;
}




//******************************************************************************
//******************************************************************************




function onSignIn(googleUser) {
  console.log('Google Auth Response', googleUser);
	profile = googleUser.getBasicProfile();
  //Displaying currently signed in Google User
  document.getElementById('googleProfilePicture').src = profile.getImageUrl();
  document.getElementById('googleProfilePicture').style.visibility = "visible";

  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
  		//Build Firebase credential with the Google ID token.
  		var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);

  		// Sign in with credential from the Google user.
  		firebase.auth().signInWithCredential(credential).catch(function(error) {
  			// Handle Errors here.
  			console.error(error.message);
      });
      console.log("Signed " + profile.getName() + " into Firebase.");
    } else {
      console.log(profile.getName() + ' is already signed-in to Firebase.');
    }
  });
}

function onSignInFailure(msg) {
	console.error(msg);
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
