// Import the functions you need from the SDKs you need
//import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app-compat.js";
//import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore-compat.js"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBA6uHgA-pwbYWh5GxtTaj4Vlw_ZnJIzVc",
    authDomain: "final-project-a208a.firebaseapp.com",
    projectId: "final-project-a208a",
    storageBucket: "final-project-a208a.firebasestorage.app",
    messagingSenderId: "737353748741",
    appId: "1:737353748741:web:bf11dc4d4e4c5c27e9276c"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

window.addData = function(data)
{
    db.collection('entries').add(data);
}

window.readData = function() {
    return db.collection("entries")
        // .limit(10)
        .get()
        .then((querySnapshot) => querySnapshot.docs.map(doc => doc.data()))
        .catch((error) => {
            console.log("Error getting documents: ", error);
            throw error;
        });
}