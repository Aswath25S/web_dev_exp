// Imports
import { initializeApp } from "firebase/app";
import { getAuth, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        signOut, 
        onAuthStateChanged,
        GoogleAuthProvider,
        signInWithPopup,
        updateProfile
    } from "firebase/auth";

// Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyAVc-D6avZkFUohRwp4QFwmYt6ikM72oQI",
  authDomain: "fir-1-44586.firebaseapp.com",
  projectId: "fir-1-44586",
  storageBucket: "fir-1-44586.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// UI Elements
const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")

const userProfilePictureEl = document.getElementById("user-profile-picture")
const userGreetingEl = document.getElementById("user-greeting")

// UI Event Listeners


signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

// Main Code 

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView()
    showProfilePicture(userProfilePictureEl, user)
    showUserGreeting(userGreetingEl, user)
  } else {
    showLoggedOutView()
  }
});


// Auth Functions

function authSignInWithGoogle () {
    signInWithPopup(auth, provider).
    then((result) => {
        console.log("Signed in with google");
    }).
    catch((error) => {
        console.log(error.message);
    });
}

function authSignInWithEmail () {
    const email = emailInputEl.value
    const password = passwordInputEl.value
    
    signInWithEmailAndPassword(auth, email, password).
    then((userCredential) => {
        clearAuthField()
    }).
    catch((error) => {
        console.log(error.message)
    });
}

function authCreateAccountWithEmail () {
    const email = emailInputEl.value
    const password = passwordInputEl.value

    createUserWithEmailAndPassword(auth, email, password).
        then((userCredential) => {
            clearAuthField()
        }).catch((error) => {
            console.log(error)
        })
}

function authSignOut () {
    signOut(auth).then(() => {
    }).
    catch((error) => {
        console.log(error.message)
    });
}

// UI Functions

function showLoggedOutView() {
    hideView(viewLoggedIn);
    showView(viewLoggedOut);
}

function showLoggedInView() {
    hideView(viewLoggedOut);
    showView(viewLoggedIn);
}

function hideView(view) {
    view.style.display = "none";
}

function showView(view) {
    view.style.display = "flex";
}

function clearInputField(field) {
    field.value = ""
}

function clearAuthField() {
    clearInputField(emailInputEl);
    clearInputField(passwordInputEl);
}

function showProfilePicture(imgEl, user){
    const photoURL = user.photoURL;
    if(photoURL){
        imgEl.src = photoURL
    }else{
        imgEl.src = "./src/assets/images/default-profile-picture.jpeg"
    }
}

function showUserGreeting(element, user){
    const displayName = user.displayName;
    if(displayName){
        const userFirstName = displayName.split(" ")[0];
        element.textContent = `Hey ${userFirstName}, how are you ?`
    }else {
        element.textContent = `Hey friend, how are you ?`
    }
}