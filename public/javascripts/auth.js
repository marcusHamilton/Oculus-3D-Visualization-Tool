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

var provider = new firebase.auth.GoogleAuthProvider();

// //Force user to sign in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
  	firebase.auth().signInWithRedirect(provider);
  }
});

function onSignIn(googleUser) {
  console.log('Google Auth Response', googleUser);
  var profile = googleUser.getBasicProfile();
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