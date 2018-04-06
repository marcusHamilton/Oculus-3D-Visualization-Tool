var positionObj;
var dbPositionObj;
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

  firebase.auth().onAuthStateChanged(function(user) {
    // User is signed in.
    if(user){
    } 
    // User is not signed in.
    else{
      //relocate them to the home page if they sign out while on the dashboard
      if (document.URL.indexOf("dashboard") !== -1){
        window.location.href = "/";
        console.log("Redirecting user to the home page from the dashboard because they are not signed-in.");
      }
    }
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
    }
    else{
      console.log(profile.getName() + ' is already signed-in to Firebase.');
      postLogin();
    }
  });
}

//Program flow after the user successfully signs in or is already signed-in
function postLogin() {
  //create user in DB for the authenticated user if there isn't one already
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

//******************************************************************************
//                          DATABASE functions
//******************************************************************************

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
      "given_name": profile.getGivenName(),
      "family_name": profile.getFamilyName()
    },
    "email": profile.getEmail(),
    "profile_picture": profile.getImageUrl()
  });
  console.log("Success: Added " + profile.getName() + " as an authenticated user to the database.");
}

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
    userWorldObj[worldRefKey] = true;
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

    //user owns the world, remove it completely from the database as well as collaborations
    if (world.owner_id == getUID()) {

      return database.ref('collaborations/' + world.collaboration_id).once('value').then(function (snapshot){
        var collaborationRef = snapshot.val();

        //if there are collaborators for the world being deleted, remove the world from their list of collaborations
        if(collaborationRef){
          for(var collaboratorKey in collaborationRef.collaborators){
            database.ref('users/' + collaboratorKey + '/collaborations/' +world.collaboration_id).remove();
          }
          //remove the collaboration object
          database.ref('collaborations/' + world.collaboration_id).remove();
        }

        //remove the owner's world completely
        database.ref('users/' + getUID() + '/worlds/' + id).remove();
        database.ref('worlds/' + id).remove();
        console.log("Deleted the user's world" + id + ".");
        reloadWorlds();
      });

    }
    //User must be a collaborator so remove them from the world's list of collaborators
    else {
      database.ref('users/' + getUID() + '/collaborations/' + world.collaboration_id).remove();
      database.ref('collaborations/' + world.collaboration_id + '/collaborators/' + getUID()).remove();
      console.log("Removed the user: " + getUID() + " from the list of collaborators for the world: " + id + ".");
      reloadWorlds();
    }
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
    // console.log(snapshot.val());
    // UPDATE THE GEOMETRY IN THE SCENE
  });
}

//Listener
function onAxisDatabaseChange(worldId) {
  var axisRef = database.ref('worlds/' + worldId + '/object/userData/0');
  axisRef.on('value', function (dataSnapshot) {
      loadedDataset[0] = dataSnapshot.val();
      selectedAxes.selectedX = axisMenu.axesOptions[loadedDataset[0][0]];
      selectedAxes.selectedY = axisMenu.axesOptions[loadedDataset[0][1]];
      selectedAxes.selectedZ = axisMenu.axesOptions[loadedDataset[0][2]];
      redraw.redrawVR();
	  // console.log("Axis received");
  });
}

//Listener
function onSelectionChange(worldId) {
  var axisRef = database.ref('worlds/' + worldId + '/object/selectionArray');
  axisRef.on('value', function (dataSnapshot) {
    // console.log(dataSnapshot.val()); //uncomment to see the value from the database
    if(dataSnapshot.val() != null){
      selectedPoints = dataSnapshot.val();
      redraw.redrawVR();
    }
    else{
      console.log("No selected points saved in DB.")
      selectedPoints = [];
      redraw.redrawVR();
    }
  });
}
//You only need to call this function once and it will listen for position changes.
//+ Whenever another users position in the world changes, the contents of this function
//+ will be run.
//Input: current world id
//Returns: geometry object (json) that has changed in the database
function onUserPositionChange(worldId, UID) {
  var userRef = database.ref('worlds/' + worldId + '/object/usersData/');
  userRef.on('value', function (snapshot) {
    // console.log("Pos from the db" + snapshot.val());
    dbPositionObj = snapshot.val();
    var array = Object.keys(dbPositionObj);
    for(var i = 0 ; i < array.length; i++){
      if(array[i] != getUID()){
          otherUsers[i].position.x = dbPositionObj[array[i]].position.x + datasetAndAxisLabelGroup.getWorldPosition().x;
          otherUsers[i].position.y = dbPositionObj[array[i]].position.y + datasetAndAxisLabelGroup.getWorldPosition().y;
          otherUsers[i].position.z = dbPositionObj[array[i]].position.z + datasetAndAxisLabelGroup.getWorldPosition().z;
          otherUsers[i].visible = true;
          
        //console.log("User: " + array[i] + "'s x position is: " + dbPositionObj[array[i]].position.x);
      }
    }
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
When the selected axes change for a world and need to be pushed to the database, call this function
@Inputs:
  worldId: ID of the world in the database
  selectedAxii: JSON format of the loadedDataset[0] array(aka the axii selection array)  
*/
function updateAxisSelectionInDatabase(worldId, selectedAxesJSON) {
  var axesRef = database.ref('worlds/' + worldId + '/object/userData')
  var AxiiSelection = axesRef.child("0");
  AxiiSelection.set(selectedAxesJSON);
  // console.log("Pushed selection " + selectedAxesJSON + " to the database.")
}

//push selected points to db
function updateSelectionInDatabase(worldId, selectedPointsJSON) {  
  var selectionRef = database.ref('worlds/' + worldId + '/object/selectionArray');
  selectionRef.set(selectedPointsJSON);
  // console.log("Pushed selection " + selectedPointsJSON + " to the database.");
}
/*
When a users position changes within a world and needs to be pushed to the database, call this function
@Inputs:
  worldId: ID of the world in the database
  selectedAxii: JSON format of the players location  
*/
function updateUserPositionInDatabase(worldId, UID) {
  var userRef = database.ref('worlds/' + worldId + '/object/usersData/' + getUID() + '/position');
  positionObj = camera.getWorldPosition();
  var datPos= datasetAndAxisLabelGroup.getWorldPosition();
  positionObj.x = positionObj.x - datPos.x;
  positionObj.y = positionObj.y - datPos.y;
  positionObj.z = positionObj.z - datPos.z;

  var PosJSON = JSON.stringify(positionObj);
  // console.log("Pushing: " + PosJSON);
  PosJSON = JSON.parse(PosJSON);

  userRef.set(PosJSON);
  // console.log("Pushed position of " + UID + ".Their position is: " + rig.getWorldPosition());
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
    return result;
  });
}

//reloads the dashboard to get all the worlds a user owns and collaborates with
function reloadWorlds(){
  var myNode = document.getElementById("worldContainer");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  document.getElementById('spinningLoader').style = "display:block";

  //Fetch all the worlds that a user owns
  //TODO: Fetch worlds they collaborate with as well
  return database.ref('users/' + getUID()).once('value').then(function (snapshot) {
    var user = snapshot.val();

    //load in each user owned world
    for (var worldKey in user.worlds) {
      //Key must evaluate to true in order for user to have access to the world
      if (user.worlds[worldKey]) {
        document.getElementById('spinningLoader').style = "display:none";
        reloadHelper(worldKey);
      }
    }
    //load in collaboration worlds
    for(var collabKey in user.collaborations){
      //Key must evaluate to true in order for user to have access to the world
      if (user.collaborations[collabKey]) {
      	reloadCollaborationHelper(collabKey);
      }
    }
  });
}

//gets the world_ID for an individual collaboration
function reloadCollaborationHelper(collabKey){
	//get the world associated with the collaboration object and load it in for the user
    return database.ref('collaborations/' +collabKey).once('value').then(function (snapshot){
		var collaboration = snapshot.val();

		document.getElementById('spinningLoader').style = "display:none";
		reloadHelper(collaboration.world_id);
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
    //check if email is synced with a valid user
    return database.ref("worlds/" +worldID).once('value').then(function(snapshot){
      var world = snapshot.val();

      //only owners of worlds can add collaborators to their worlds
      if(world.owner_id = getUID()){
        checkUserEmailExists(email, worldID);
      }
      else{
        alert("You must be the owner of the world: " + worldID + " to add collaborators to it.");
      }
    });
  }
  else{
    alert("Please sign-in with your gmail account.");
  }
}

//makes sure that the given collaborator email has a valid user existing
  //if it does not find a user then no changes are made in collaboration
function checkUserEmailExists(collabEmail, worldID){
  return database.ref('users').orderByKey().once('value').then(function(snapshot){
    var found = 0;
    snapshot.forEach(function(childSnapshot) {
      //search through each user to find the user associated with the email
      var collab = childSnapshot.val();
      var collabKey = childSnapshot.key;

      //emails match
      if(collab.email == collabEmail){
        //check whether the world has a collaboration made 
        checkWorldCollab(collabKey, worldID);
        found = 1;
        return true;
      }
    });
    if(found == 0){
      alert("ERROR: There are no users associated with the email: " + collabEmail);
    }
  });
}

//check if the world exists in collaborations
    //if there is a collaboration, then add the user to the list
    //if there isn't a collaboration, make a new one and add the user to the list
function checkWorldCollab(collaboratorID, worldID){
  return database.ref("worlds/" +worldID).once('value').then(function(snapshot){
    var world = snapshot.val();
    if(world.collaboration_id){
      //push to existing collaboration
      addToWorldCollab(collaboratorID, worldID, world.collaboration_id);
    }
    else{
      //create a new collaboration for the world
      createWorldCollab(collaboratorID, worldID);
    }
  });
}

//adds a collaboration to an existing collaboration
function addToWorldCollab(collaboratorID, worldID, collaborationID){
  var collaboratorObj = {};
  var collaborationObj = {};
  var collaborationRef;
  collaboratorObj[collaboratorID] = true;
  collaborationObj[collaborationID] = true;


  //updates the collaboration object as well as the collaborators list of collaborations
  collaborationRef = database.ref('/collaborations/' + collaborationID).child("collaborators").update(collaboratorObj);
  userRef = database.ref('users/' + collaboratorID).child("collaborations").update(collaborationObj);

  console.log("Successfully added user: " + collaboratorID + " to the collaborations list for world: " + worldID + ".");
}

//creates a new collaboration object for the world and adds the first collaborator to it
function createWorldCollab(collaboratorID, worldID){
  var collaboratorObj = {};
  var collaborationUserObj = {};
  var collaborationWorldObj = {};
  var collaborationJSON = {};
  var ownerID = getUID();
  var collaborationRef, worldRef, collaboratorRef;

  //preparing to push ownerID, worldID and collaboratorID to the collaboration object
  collaboratorObj[collaboratorID] = true;

  collaborationJSON['owner_id'] = ownerID;
  collaborationJSON['world_id'] = worldID;
  collaborationJSON['collaborators'] = collaboratorObj;

  //Pushing the new collaboration to the database
  collaborationRef = database.ref('/collaborations').push(collaborationJSON);

  //using the collaboration ID an object to be pushed to worlds and user collaboration info
  collaborationUserObj[collaborationRef.key] = true;
  collaborationWorldObj['collaboration_id'] = collaborationRef.key;

  //Update the world and collaborator with the collaboration
  collaboratorRef = database.ref('users/' + collaboratorID).child("collaborations").update(collaborationUserObj);
  worldRef = database.ref('worlds/' + worldID).update(collaborationWorldObj);

  console.log("Successfully added user: " + collaboratorID + " to the collaborations list for world: " + worldID + ".");
}
//******************************************************************************
//******************************************************************************




function AddWorldByKey(worldRefKey){
      var userWorldObj = {};
    userWorldObj[worldRefKey] = 'true';
    console.log(worldRefKey);
    firebase.database().ref('/users/' + getUID()).child("worlds").update(userWorldObj);
}