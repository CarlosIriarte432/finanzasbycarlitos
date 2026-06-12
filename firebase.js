import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyBD8FtwhhSIg7n7aXXZwnYEWn1gv0xODOY",

    authDomain:
        "finanzasbycarlitos.firebaseapp.com",

    projectId:
        "finanzasbycarlitos",

    storageBucket:
        "finanzasbycarlitos.firebasestorage.app",

    messagingSenderId:
        "755105057115",

    appId:
        "1:755105057115:web:7cb36f0b9c82ec40f2f27e",

    measurementId:
        "G-R0WVNH9HSG"
};

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);

const provider =
    new GoogleAuthProvider();

export {
    auth,
    db,
    provider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
};