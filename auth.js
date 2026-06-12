console.log("auth cargado");

import {
    auth,
    provider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
}
from "./firebase.js";

const loginBtn =
    document.getElementById("loginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const usuarioActual =
    document.getElementById("usuarioActual");

loginBtn.addEventListener(
    "click",
    async () => {

        console.log("click login");

        try {

            await signInWithPopup(
                auth,
                provider
            );

        } catch(error) {

            console.error(error);
        }
    }
);

logoutBtn.addEventListener(
    "click",
    async () => {

        await signOut(auth);
    }
);

onAuthStateChanged(
    auth,
    user => {

        window.usuarioFirebase = user;

        if(user){

            usuarioActual.textContent =
                user.email;

        }else{

            usuarioActual.textContent =
                "No autenticado";
        }
    }
);