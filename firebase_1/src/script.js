// Imports
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Firebase Setup
const firebaseConfig = {
  apiKey: "AIzaSyAVc-D6avZkFUohRwp4QFwmYt6ikM72oQI",
  authDomain: "fir-1-44586.firebaseapp.com",
  projectId: "fir-1-44586",
  storageBucket: "fir-1-44586.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

const testButton = document.getElementById("test-btn")

// UI Event Listeners


signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

testButton.addEventListener("click", onTestBtnClick)


// Main Code 

showLoggedOutView()


// Auth Functions

function authSignInWithGoogle () {
    console.log("Sign in with Google")
}

function authSignInWithEmail () {
    console.log("Sign in with email")
}

function authCreateAccountWithEmail () {
    const email = emailInputEl.value
    const password = passwordInputEl.value

    createUserWithEmailAndPassword(auth, email, password).
        then((userCredential) => {
            showLoggedInView()
        }).catch((error) => {
            console.log(error)
        })
}

// UI Functions

function showLoggedOutView() {
    hideElement(viewLoggedIn);
    showElement(viewLoggedOut);
}

function showLoggedInView() {
    hideElement(viewLoggedOut);
    showElement(viewLoggedIn);
}

function hideElement(element) {
    element.style.display = "none";
}

function showElement(element) {
    element.style.display = "flex";
}

function onTestBtnClick() {
    let disp = viewLoggedOut.style.display;
    if (disp === "none"){
        viewLoggedOut.style.display = "flex";
    }
    else {
        viewLoggedOut.style.display = "none";
    }
}