import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getDatabase,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxhPZTqDv03XBNCK2340Z10-zxqk8s3Ts",
  authDomain: "movie-fe315.firebaseapp.com",
  databaseURL: "https://movie-fe315-default-rtdb.firebaseio.com",
  projectId: "movie-fe315",
  storageBucket: "movie-fe315.appspot.com",
  messagingSenderId: "140742795584",
  appId: "1:140742795584:web:806eec25ebb06ae8491aa5",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

document.querySelector(".login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("login-pass").value;
  const rememberMe = document.querySelector(".login-check-input").checked;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      if (rememberMe) {
        localStorage.setItem("userToken", user.accessToken);
      }
      const dt = new Date();
      update(ref(database, `users/${user.uid}`), {
        last_login: dt,
      })
        .then(() => {
          alert("You`ve logged in!");
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error();
        });
    })
    .catch((error) => {
      console.error(error);
    });
});

const showHiddenPass = (loginPass, loginEye) => {
  const input = document.getElementById(loginPass),
    iconEye = document.getElementById(loginEye);
  iconEye.addEventListener("click", () => {
    if (input.type === "password") {
      input.type = "text";
      iconEye.classList.add("ri-eye-line");
      iconEye.classList.remove("ri-eye-off-line");
    } else {
      input.type = "password";
      iconEye.classList.remove("ri-eye-line");
      iconEye.classList.add("ri-eye-off-line");
    }
  });
};
showHiddenPass("login-pass", "login-eye");

window.addEventListener("load", () => {
  const userToken = localStorage.getItem("userToken");
  if (userToken) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        alert("Welcome back");
        window.location.href = "index.html";
      } else {
        window.location.href = "login.html";
      }
    });
  }
});
