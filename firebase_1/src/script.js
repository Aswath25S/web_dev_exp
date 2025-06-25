// Imports
import { initializeApp } from "firebase/app";
import { getAuth, 
        createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        signOut, 
        onAuthStateChanged,
        GoogleAuthProvider,
        signInWithPopup
    } from "firebase/auth";
import { getFirestore, 
        collection, 
        addDoc,
        serverTimestamp
    } from "firebase/firestore"

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
const db = getFirestore(app)

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

const moodEmojiEls = document.getElementsByClassName("mood-emoji-btn")
const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")


// UI Event Listeners


signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

for (let moodEmojiEl of moodEmojiEls) {
    moodEmojiEl.addEventListener("click", selectMood)
}

postButtonEl.addEventListener("click", postButtonPressed)

// State

let moodState = 0;

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

async function addPostToDB(postBody, user) {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            body : postBody,
            uid : user.uid,
            mood : moodState,
            createdAt : serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (error) {
    console.error("Error adding document: ", error.message);
    }
}

// UI Functions

function postButtonPressed() {
    const postBody = textareaEl.value;
    const user = auth.currentUser;
    if(postBody && moodState > 0) {
        clearInputField(textareaEl);
        addPostToDB(postBody, user);
        resetAllMoodEmojis(moodEmojiEls);
    }
}

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

// Mood Functions

function selectMood(Event) {
    const selectedMoodEmojiId = Event.currentTarget.id;
    changeMoodStyle(selectedMoodEmojiId, moodEmojiEls);
    const chosenMoodValue = returnMoodValue(selectedMoodEmojiId);
    moodState = chosenMoodValue;
}

function changeMoodStyle(selectedMoodId, allMoodElements) {
    for(let moodElement of allMoodElements){
        if (moodElement.id === selectedMoodId) {
            moodElement.classList.remove("unselected-emoji");
            moodElement.classList.add("selected-emoji");
        } else {
            moodElement.classList.add("unselected-emoji");
            moodElement.classList.remove("selected-emoji");
        }
    }
}

function resetAllMoodEmojis(allMoodElements) {
    for(let moodElement of allMoodElements) {
        moodElement.classList.remove("selected-emoji");
        moodElement.classList.remove('unselected-emoji');
    }
    moodState = 0;
}

function returnMoodValue(elementId) {
    return Number(elementId.slice(5))
}