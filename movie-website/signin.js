const showHiddenPass = (signinPass, signinEye) => {
  const input = document.getElementById(signinPass);
  const iconEye = document.getElementById(signinEye);
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
showHiddenPass("signin-pass", "signin-eye");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getDatabase,
  ref as databaseRef,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import {
  getStorage,
  ref as storagesRef,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

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
const storage = getStorage(app);

document.querySelector(".signin-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("signin-pass").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      set(databaseRef(database, `users/${user.uid}`), {
        email: email,
        password:password
      })
        .then(() => {
          alert("You have registered");
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Error saving user data:", error);
        });
    })
    .catch((error) => {
      console.error("Error creating user:", error);
    });
});

const portraitUpload = document.getElementById("img-upload");
const fileItem = document.getElementById("fileInput");
const imageLabel = document.querySelector(".image-label");

portraitUpload.addEventListener("click", () => {
  fileItem.click();
});

fileItem.addEventListener("change", () => {
  const file = fileItem.files[0];
  if (file) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUid = user.uid;
        const storageRef = storagesRef(
          storage,
          `images/${userUid}/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            imageLabel.innerHTML = `Uploading: ${file.name} (${progress.toFixed(
              0
            )}%)`;
          },
          (error) => {
            console.error("Error uploading file:", error);
            imageLabel.innerHTML = `Error uploading: ${file.name}`;
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              imageLabel.innerHTML = `Uploaded: ${file.name}`;
              console.log("File available at", downloadURL);
            });
          }
        );
      } else {
        console.log("No user is signed in.");
      }
    });
  }
});
