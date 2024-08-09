import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getDatabase,
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getStorage,
  ref as storagesRef,
  getDownloadURL,
  listAll,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxhPZTqDv03XBNCK2340Z10-zxqk8s3Ts",
  authDomain: "movie-fe315.firebaseapp.com",
  databaseURL: "https://movie-fe315-default-rtdb.firebaseio.com",
  projectId: "movie-fe315",
  storageBucket: "movie-fe315.appspot.com",
  messagingSenderId: "140742795584",
  appId: "1:140742795584:web:806eec25ebb06ae8491aa5",
};

const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
  ".card-title, .navbar-container, .sidebar, .left-menu-icon, .menu-list, .menu-list-item a, .toggle"
);
ball.addEventListener("click", () => {
  items.forEach((item) => {
    item.classList.toggle("active");
  });
  ball.classList.toggle("active");
});

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);
function displayPhoto(url) {
  const profile = document.querySelector(".profile-picture");
  if (profile) {
    profile.src = url;
  } else {
    console.error("Profil sekli tapilmadi");
  }
}
function displayPhotoForUser(userUid) {
  const storageRef = storagesRef(storage, `images/${userUid}`);
  console.log(`sekiller buradan fetch olunur: images/${userUid}`);
  listAll(storageRef)
    .then((result) => {
      if (result.items.length > 0) {
        const itemRef = result.items[0];
        getDownloadURL(itemRef)
          .then((url) => {
            displayPhoto(url);
          })
          .catch((error) => {
            console.error("error in download URL:", error);
          });
      } else {
        console.log("Bu user ucun sekil tapilmadi.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

window.addEventListener("load", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userUid = user.uid;
      console.log(`User UID: ${userUid}`);
      displayPhotoForUser(userUid);
      document.querySelector(".profile-name").textContent = user.email;
    } else {
      console.log("No user is signed in.");
    }
  });
});

onValue(ref(database, "movies/"), (snapshot) => {
  const moviesContainer = document.querySelector(".movie-list-general");
  moviesContainer.innerHTML = "";
  snapshot.forEach((snap) => {
    const movieData = Object.values(snap.val());
    const movieElement = createMovie(movieData);
    moviesContainer.appendChild(movieElement);
  });
});

function createMovie(item) {
  const movieListItem = document.createElement("div");
  movieListItem.classList.add("movie-list-item");

  const moviePoster = document.createElement("img");
  moviePoster.classList.add("movie-list-item-img");
  moviePoster.src = item[1];

  const movieTitle = document.createElement("p");
  movieTitle.classList.add("movie-list-item-title");
  movieTitle.textContent = item[2];

  const movieDesc = document.createElement("p");
  movieDesc.classList.add("movie-list-item-desc");
  movieDesc.textContent = item[0];

  const movieBtn = document.createElement("button");
  movieBtn.classList.add("movie-list-item-button");
  movieBtn.textContent = "Watch";

  const saveIcon = document.createElement("a");
  saveIcon.classList.add("save-icon");
  saveIcon.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;
  saveIcon.addEventListener("click", () => {
    const movieRef = ref(database, "movies/" + item[2]);
    remove(movieRef);
  });

  movieListItem.appendChild(moviePoster);
  movieListItem.appendChild(saveIcon);
  movieListItem.appendChild(movieTitle);
  movieListItem.appendChild(movieDesc);
  movieListItem.appendChild(movieBtn);

  return movieListItem;
}
