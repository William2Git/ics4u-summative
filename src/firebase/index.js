import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyCU5Ja3H17YjL9wk8Muk3lhKLCxT9Qgio8",
    authDomain: "summative-b72c9.firebaseapp.com",
    projectId: "summative-b72c9",
    storageBucket: "summative-b72c9.firebasestorage.app",
    messagingSenderId: "837074365666",
    appId: "1:837074365666:web:55f3538c975a4595ae82bb"
  };

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };