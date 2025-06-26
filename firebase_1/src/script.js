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
        serverTimestamp,
        onSnapshot,
        query,
        where,
        orderBy,
        doc,
        updateDoc,
        deleteDoc
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

const allFilterBtn = document.getElementById("all-filter-btn")
const filterButtonEls = document.getElementsByClassName("filter-btn")

const postsEl = document.getElementById("posts")


// UI Event Listeners


signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

for (let moodEmojiEl of moodEmojiEls) {
    moodEmojiEl.addEventListener("click", selectMood)
}

for (let filterBtn of filterButtonEls) {
    filterBtn.addEventListener("click", selectFilter)
}

postButtonEl.addEventListener("click", postButtonPressed)

// State

let moodState = 0;
const collectionName = "posts"

// Main Code 

onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInView();
    showProfilePicture(userProfilePictureEl, user);
    showUserGreeting(userGreetingEl, user);
    updateFilterButtonStyle(allFilterBtn);
    fetchAllPosts(user);
  } else {
    showLoggedOutView();
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
        const docRef = await addDoc(collection(db, collectionName), {
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

async function updatePostInDB(docId, newBody) {
    const postRef = doc(db, collectionName, docId);
    await updateDoc(postRef, {
        body : newBody
    })
}

async function deletePostFromDB(docId) {
    await deleteDoc(doc(db, collectionName, docId));
}

function fetchRealTimeRenderPosts(user, query) {
    onSnapshot(query, (querySnapshot) => {
        clearAll(postsEl);
        querySnapshot.forEach((doc) => {
            renderPosts(postsEl, doc)
        })
    })
}

function fetchTodayPosts(user) {
    const startOfDay = new Date();
    const endOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    const postRef = collection(db, collectionName)
    const q = query(postRef, 
                    where("uid", "==", user.uid), 
                    where("createdAt", ">=", startOfDay),
                    where("createdAt", "<=", endOfDay),
                    orderBy("createdAt", "desc"))
    
    fetchRealTimeRenderPosts(user, q)
}

function fetchWeekPosts(user) {
    const startOfWeek = new Date()
    startOfWeek.setHours(0, 0, 0, 0)
    
    if (startOfWeek.getDay() === 0) {
        startOfWeek.setDate(startOfWeek.getDate() - 6)
    } else {
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
    }
    
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)
    
    const postsRef = collection(db, collectionName)
    
    const q = query(postsRef, where("uid", "==", user.uid),
                              where("createdAt", ">=", startOfWeek),
                              where("createdAt", "<=", endOfDay),
                              orderBy("createdAt", "desc"))
                              
    fetchRealTimeRenderPosts(user, q)
}

function fetchMonthPosts(user) {
    const startOfMonth = new Date()
    startOfMonth.setHours(0, 0, 0, 0)
    startOfMonth.setDate(1)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

	const postsRef = collection(db, collectionName)
    
    const q = query(postsRef, where("uid", "==", user.uid),
                              where("createdAt", ">=", startOfMonth),
                              where("createdAt", "<=", endOfDay),
                              orderBy("createdAt", "desc"))

    fetchRealTimeRenderPosts(user, q)
}

function fetchAllPosts(user) {
    const postsRef = collection(db, collectionName)
    const q = query(postsRef, where("uid", "==", user.uid),
                              orderBy("createdAt", "desc"))

    fetchRealTimeRenderPosts(user, q)
}

// UI Functions

function createPostHeader(postData) {
    /*
        <div class="header">
        </div>
    */
    const headerDiv = document.createElement("div")
    headerDiv.className = "header"
    
        /* 
            <h3>21 Sep 2023 - 14:35</h3>
        */
        const headerDate = document.createElement("h3")
        headerDate.textContent = displayDate(postData.createdAt)
        headerDiv.appendChild(headerDate)
        
        /* 
            <img src="assets/emojis/5.png">
        */
        const moodImage = document.createElement("img")
        moodImage.src = `./src/assets/emojis/${postData.mood}.png`
        headerDiv.appendChild(moodImage)
        
    return headerDiv
}

function createPostBody(postData) {
    /*
        <p>This is a post</p>
    */
    const postBody = document.createElement("p")
    postBody.innerHTML = replaceNewlinesWithBrTag(postData.body)
    
    return postBody
}

function createPostUpdateButton(wholeDoc) {
    const postId = wholeDoc.id;
    const postData = wholeDoc.data();

    const button = document.createElement("button");
    button.textContent = "Edit";
    button.classList.add("edit-color");
    button.addEventListener("click", function() {
        const newBody = prompt("Edit the post", postData.body);
        if(newBody){
            updatePostInDB(postId, newBody);
        }
    })
    return button
}

function createPostDeleteButton(wholeDoc) {
    const postId = wholeDoc.id;
    const button = document.createElement("button");
    button.textContent = "Delete";
    button.classList.add("delete-color");
    button.addEventListener("click", function() {
        deletePostFromDB(postId)
    })
    return button
}

function createPostFooter(wholeDoc) {
    const footerDiv = document.createElement("div");
    footerDiv.className = "footer";
    footerDiv.appendChild(createPostUpdateButton(wholeDoc));
    footerDiv.appendChild(createPostDeleteButton(wholeDoc));
    return footerDiv
}

function renderPosts(postsEl, wholeDoc) {
    const postData = wholeDoc.data()
    const postDiv = document.createElement("div")
    postDiv.className = "post"
    
    postDiv.appendChild(createPostHeader(postData))
    postDiv.appendChild(createPostBody(postData))
    postDiv.appendChild(createPostFooter(wholeDoc))
    
    postsEl.appendChild(postDiv)
}

function replaceNewlinesWithBrTag(inputString) {
    return inputString.replace(/\n/g, "<br>")
}

function postButtonPressed() {
    const postBody = textareaEl.value;
    const user = auth.currentUser;
    if(postBody && moodState > 0) {
        clearInputField(textareaEl);
        addPostToDB(postBody, user);
        resetAllMoodEmojis(moodEmojiEls);
    } else {
        console.log('post incomplete');
    }
}

function clearAll(element) {
    element.innerHTML = ``;
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

function displayDate(firebaseDate) {
    if (!firebaseDate){
        return "Date Loading"
    }
    const date = firebaseDate.toDate();

    const day = date.getDate();
    const year = date.getFullYear();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()]

    let hours = date.getHours()
    let minutes = date.getMinutes()
    hours = hours < 10 ? "0" + hours : hours
    minutes = minutes < 10 ? "0" + minutes : minutes

    return `${day} ${month} ${year} - ${hours}:${minutes}`
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

// Date Filters

function resetAllFilterButtons(allFilterButtons) {
    for (let filterButtonEl of allFilterButtons) {
        filterButtonEl.classList.remove("selected-filter")
    }
}

function updateFilterButtonStyle(element) {
    element.classList.add("selected-filter");
}

function fetchPostsFromPeriod(period, user) {
    if (period === "today") {
        fetchTodayPosts(user);
    } else if (period === "week") {
        fetchWeekPosts(user);
    } else if (period === "month") {
        fetchMonthPosts(user);
    } else {
        fetchAllPosts(user);
    }
}

function selectFilter(event) {
    const user = auth.currentUser;
    const selectedFilterElementId = event.target.id;
    const selectedFilterPeriod = selectedFilterElementId.split("-")[0];
    const selectedFilterElement = document.getElementById(selectedFilterElementId);
    
    resetAllFilterButtons(filterButtonEls);
    updateFilterButtonStyle(selectedFilterElement);

    fetchPostsFromPeriod(selectedFilterPeriod, user);
}