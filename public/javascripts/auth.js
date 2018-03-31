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

//When the DOM loads the sign in state is rendered
function renderButton() {
  gapi.load('auth2', function () {
    gapi.signin2.render('gSignIn', {
      'scope': 'profile email',
      'width': 100,
      'height': 30,
      'theme': 'dark',
      'onsuccess': signInSuccess,
      'onfailure': signInFailure
    });
  });
}

//User successfully signs in with Google oAuth, proceed to Firebase authentication
function signInSuccess(googleUser) {
  //Collect user's google information then disconnect from google sign-in
  console.log('Google Auth Response', googleUser);
  profile = googleUser.getBasicProfile();

  var profileHTML = '<img class="img-circle" id="profilePicture" src="' + profile.getImageUrl() + '"><button class="btn btn-primary btn-sm" onclick="signOut();"><span class="glyphicon glyphicon-log-out"></span> Sign out</button>';
  $('#gSignIn').hide();
  $('.userContent').html(profileHTML);

  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    unsubscribe();

    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      //Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);

      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential).then(function (snapshot) {
        console.log("Signed " + profile.getName() + " into Firebase.");
        postLogin();
      });
    } else {
      console.log(profile.getName() + ' is already signed-in to Firebase.');
      postLogin();
    }
  });
}

//Program flow after the user successfully signs in or is already signed-in
function postLogin() {
  userExistsDB(getUID());
  //reloadWorlds if currently on the dashboard
  if (document.URL.indexOf("dashboard") !== -1) {
    reloadWorlds();
  } else {
    //do nothing extra since we are not on the dashboard
  }
}

//Sign in failure
function signInFailure(msg) {
  console.error(msg);
}

//Signs user out of Firebase and Google oAuth
function signOut() {
  firebase.auth().signOut().then(function () {
    //Firebase Sign-out successful.

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect();
    auth2.signOut().then(function () {
      $('.userContent').html('');
      $('#gSignIn').fadeIn('slow');

      //Google Sign-out successful
      console.log('Signed-out ' + profile.getName() + '.');
    });
  }).catch(function (error) {
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
function userExistsDB(firebaseUID) {
  database.ref("users/" + firebaseUID).once("value", snapshot => {
    const userData = snapshot.val();
    if (userData) {
      //User exists in database already
    } else {
      //Add user to the database
      createUserDB(firebaseUID);
    }
  });
}

//Add the newly authenticated user to the database
function createUserDB(firebaseUID) {
  database.ref('users/' + firebaseUID).set({
    "name": {
      "give_name": profile.getGivenName(),
      "family_name": profile.getFamilyName()
    },
    "email": profile.getEmail(),
    "profile_picture": profile.getImageUrl()
  });
  console.log("Success: Added " + profile.getName() + " as an authenticated user to the database.");
}

//******************************************************************************
//                          DATABASE functions
//******************************************************************************

function getUID() {
  return firebase.auth().currentUser.uid;
}

//Read World
//Input: the world id (string), callback function that handles the result
//Returns: the world contents as json
function readWorld(worldId, callback) {
  var firebaseWorld;
  return database.ref('worlds/' + worldId).once('value').then(function (snapshot) {
    firebaseWorld = snapshot.val();
    // var numGeom = firebaseWorld.geometries.length;
    //
    // for (var i=0; i<numGeom; i++){
    //   firebaseWorld.geometries[i].data["normals"] = [];
    //   firebaseWorld.geometries[i].data["faces"] = [];
    // }
    callback(firebaseWorld);
  });
}


//Write World to Database
//Input: the world contents in json format
//Returns: unique id of world in the database
function writeWorld(jsonFile) {
  var user = firebase.auth().currentUser;

  //only signed-in users can create worlds
  if (user) {
    var worldRef = firebase.database().ref('/').child("worlds").push(jsonFile);
    var worldRefKey = worldRef.key;
    firebase.database().ref('/worlds/' + worldRefKey).update({
      "owner_id": user.uid
    });
    console.log('world key is: ' + worldRefKey);

    //associate the world with the signed-in user
    var userWorldObj = {};
    userWorldObj[worldRefKey] = 'true';
    firebase.database().ref('/users/' + user.uid).child("worlds").update(userWorldObj);
  } else {
    alert("Please sign in to create VR worlds.");
  }
}

/* Deletes a world from user/user_id/worlds/
 * If the user is the owner of the world: fully remove the world
 * If the user is a collaborator on the world: remove user from the collaboration
 */
function deleteWorld(id) {

  //check if user owns the world
  return database.ref('worlds/' + id).once('value').then(function (snapshot) {
    world = snapshot.val();
    console.log(world.owner_id);

    //owns the world, remove it from the database
    if (world.owner_id == getUID()) {
      database.ref('users/' + getUID() + '/worlds/' + id).remove();
      database.ref('worlds/' + id).remove();
      console.log("Deleted the user's world" + id + ".");
      //TODO: Remove from collaborators list as well
    }
    //TODO: Check if the user is a collaborator
    else {
      console.log("User cannot delete a world they do not own.");
    }

    reloadWorlds();
  });
}

//You only need to call this function once and it will listen for changes.
//+	Whenever a geometry in the world changes, the contents of this function
//+	will be run.
//Input: current world id
//Returns: geometry object (json) that has changed in the database
function onGeometryDatabaseChange(worldId) {
  var worldRef = firebase.database().ref('worlds/' + worldId + '/geometries');
  worldRef.on('child_changed', function (snapshot) {
    console.log(snapshot.val());
    // UPDATE THE GEOMETRY IN THE SCENE
  });
}

function onAxisDatabaseChange(worldId) {
  var axisRef = database.ref('worlds/' + worldId + '/object/userData/0');
  axisRef.on('child_changed', function (dataSnapshot) {
    console.log(dataSnapshot.val());
    loadedDataset[0] = dataSnapshot.val();
    selectedAxes.selectedX = axisMenu.axesOptions[loadedDataset[0][0]];
    selectedAxes.selectedY = axisMenu.axesOptions[loadedDataset[0][1]];
    selectedAxes.selectedZ = axisMenu.axesOptions[loadedDataset[0][2]];
    redraw.redrawVR();
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
function updateGeometryInDatabase(worldId, geometryId, geometry) {
  var geometryRef = database.ref('worlds/' + worldId + '/' + geometryId);
  geometryRef.update(geometry);
}

/*
When the selected axii change for a world and need to be pushed to the database, call this function
@Inputs:
  worldId: ID of the world in the database
  selectedAxii: JSON format of the loadedDataset[0] array(aka the axii selection array)  
*/
function updateAxisSelectionInDatabase(worldId, selectedAxii) {
  var axiiRef = database.ref('worlds/' + worldId + '/object/userData')
  var AxiiSelection = axiiRef.child("0");
  AxiiSelection.set(selectedAxii);
  console.log("Pushed selection " + inspectAxesJSON + " to the database.")
}


/*
Query a worldInfo object by world id
Input: the id of the world
Returns: worldInfo json object with matching world id
*/
function getWorldInfo(worldId) {
  var result;
  var worldInfoRef = database.ref('worldInfo');
  var queryRef = worldInfoRef.orderByChild("ID").equalTo(worldId);
  return queryRef.once('value').then(function (snapshot) {
    result = snapshot.val();
  }).then(function () {
    return result
  });
}

//test getWorldInfo
// var worldId = '-L6UfQx0beRgpsbWxeNt';
// var result = getWorldInfo(worldId);
// console.log(result);

//Needs to be refactored for realtime database. This is not efficient
function reloadWorlds() {
  var myNode = document.getElementById("worldContainer");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  document.getElementById('spinningLoader').style = "display:block";

  //Fetch all the worlds that a user owns
  //TODO: Fetch worlds they collaborate with as well
  return database.ref('users/' + getUID()).child("worlds").once('value').then(function (snapshot) {
    var worlds = snapshot.val();

    //load in each world
    for (var key in worlds) {
      //Key must evaluate to true in order for user to have access to the world
      if (worlds[key]) {
        reloadHelper(key);
      }
    }
    document.getElementById('spinningLoader').style = "display:none";
  });
}

//Helper function to help load in a world for a user
function reloadHelper(key){
  return database.ref("worlds/" +key).once('value').then(function(snapshot){
    var world = snapshot.val()
    if(world){
      var name = world.object.name;
      $('#worldContainer').append('  <div class="btn-group"><a href="/VRWorld" onClick="packID(this.id)" type="button" class="btn btn-primary" id="' + key + '">' + name + '</a><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button><ul class="dropdown-menu worldOptions" role="menu"><li><a href="#" id="' + key + '" data-toggle="modal" data-target="#addUser-modal" onClick="addUserHelper(this.id)">Add User</a></li><li><a href="#" onClick="deleteWorld(this.id)" id="' + key + '">Delete</a></li></ul></div>');
    }
  });
}

//adds a collaborator to a world if the user and world both exist
function addCollab(email, worldID){
  var user = firebase.auth().currentUser;

  //only signed-in users can add collaborators to their worlds
  if(user){

  }
  else{
    alert("Please sign-in with your gmail account to add collaborators to your worlds.");
  }
}
//******************************************************************************
//******************************************************************************