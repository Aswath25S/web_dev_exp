// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPIdDhRcD0jwI_md6RO875J9iD6QXFKII",
  authDomain: "fir-1-d17e9.firebaseapp.com",
  projectId: "fir-1-d17e9",
  storageBucket: "fir-1-d17e9.firebasestorage.app",
  messagingSenderId: "205354051396",
  appId: "1:205354051396:web:29a298ad6b06f3302ed911",
  measurementId: "G-FWJCT68X0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);