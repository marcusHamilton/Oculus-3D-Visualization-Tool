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

//Firebase References
var database = firebase.database();
var app = database.app;
var users = database.ref().child('users');
var worlds = database.ref().child('worlds');


function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
}

function onSignInFailure(msg) {
	console.error(msg);
}

// Uploads a new world to firebase under the currently signed-in user
function postWorld() {
	world = JSON.parse(sessionStorage.getItem('parsedCSVData'));
	var worldID = generateUUID();

	/* TODO: Use the following code instead once authentification is working:
			 var userId = sessionStorage.getItem('userID')*/
	var userID = generateUUID();

	worlds.child(worldID).set({
		ownerID: userID,
		dataPoints: world,
	});
}

// Returns the datapoints for a world stored under worldID in
function getWorld(worldID) {
	worlds.child(worldID).once('value').then(function(snapshot) {
		/* TODO: Uncomment this once authentification is in
		if (snapshot.val().ownerID == sessionStorage.getItem("userID")) {
		*/
			console.log("Successfully retrieved world " + worldID + ".";
			return snapshot.val().dataPoints;
		//}
		/*
		else {
			console.error("User does not have access to this world.");
		} */

	});
}

// Delete a given world from firebase
function deleteWorld(worldID) {
	worlds.child(worldID).remove();
}	

/* Generates a random UUID
   Source: https://jsfiddle.net/briguy37/2MVFd/ 
   Author: briguy37 */
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
