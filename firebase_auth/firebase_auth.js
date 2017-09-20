firebase.initializeApp({
  apiKey: 'AIzaSyBvhnF3Yu001L4vUrWpibWMx_2nrQfHQiM',
  databaseURL: 'https://wiresafe-project.firebaseio.com',
  storageBucket: 'wiresafe-project.appspot.com',
  authDomain: 'wiresafe-project.firebaseapp.com',
  messagingSenderId: '1039382416339',
  projectId: 'wiresafe-project'
});
console.log('FIREBASE_APP:INITIALIZED');

function getFirebaseAuthConfig() {
  return {
    tosUrl: 'http://wiresafe.com',
    signInSuccessUrl: '#/login?',
    signInFlow: 'redirect',
    callbacks: {
      signInSuccess: function(user, credential, redirectUrl) {
        console.debug('FIREBASE_AUTH:SIGN_IN_SUCCESS_CALLBACK:');
        let container = document.getElementById('firebase-auth-container');
        container.style.display = 'hidden';
        container.style.zIndex = '-1';
        // Do not redirect.
        return false;
      },
      uiShown: function() {
        console.debug('FIREBASE_AUTH:UI_SHOWN');
        let container = document.getElementById('firebase-auth-container');
        container.style.display = 'block';
        container.style.zIndex = '1000';
      }
    },
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          size: 'normal'
        }
      }
    ]
  };
}

/**
 * @return {string} The URL of the FirebaseUI standalone widget.
 */
function getWidgetUrl() {
  return '/firebase_auth/login#recaptcha=' + getRecaptchaMode();
}

/**
 * Redirects to the FirebaseUI widget.
 */
var signInWithRedirect = function() {
  window.location.assign(getWidgetUrl());
};

/**
 * Open a popup with the FirebaseUI widget.
 */
var signInWithPopup = function() {
  window.open(getWidgetUrl(), 'Sign In', 'width=985,height=735');
};

/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
  console.debug('FIREBASE_AUTH:USER-SIGNED-IN:OUTSIDE');
  document.getElementById('firebase-auth-container').style.display = 'none';
};

/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function() {
  console.debug('FIREBASE_AUTH:USER-SIGNED-OUT:OUTSIDE');
  document.getElementById('firebase-auth-container').style.display = 'block';
  // ui.reset();
  // ui.start('#firebase-auth-ui', getFirebaseAuthConfig())
};

/**
 * Handles when the user changes the reCAPTCHA config.
 */
function handleRecaptchaConfigChange() {
  var newRecaptchaValue = document.querySelector(
    'input[name="recaptcha"]:checked'
  ).value;
  location.replace(location.pathname + '#recaptcha=' + newRecaptchaValue);

  // Reset the inline widget so the config changes are reflected.
  // ui.reset();
  // ui.start('#firebase-auth-ui', getFirebaseAuthConfig());
}

/**
 * Initializes the app.
 */
// var initApp = function () {
//
// };
ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.setConfig(getFirebaseAuthConfig());
// firebase.auth().onAuthStateChanged(function (user) {
//     console.debug('FIREBASE_AUTH:onAuthStateChanged:User:', user);
//     user ? handleSignedInUser(user) : handleSignedOutUser();
// });

// window.addEventListener('load', initApp);
