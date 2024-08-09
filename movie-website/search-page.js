import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getDatabase,
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage=getStorage(app)
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

const searchInput = document.querySelector(".input-box");
const displayFilm = document.querySelector(".films-display");

async function fetchMovies(url) {
  try {
    const response = await fetch(url);
    const moviesList = await response.json();
    return moviesList;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function createMovieElement(movie) {
  const { title, overview, poster_path } = movie;
  const movieListItem = document.createElement("div");
  movieListItem.classList.add("movie-list-item");

  const moviePoster = document.createElement("img");
  moviePoster.classList.add("card-img");
  moviePoster.src = poster_path;

  const movieTitle = document.createElement("h3");
  movieTitle.classList.add("card-title");
  movieTitle.textContent = title;

  const movieDesc = document.createElement("p");
  movieDesc.classList.add("card-desc");
  movieDesc.textContent = overview;

  const readMore = document.createElement("a");
  readMore.textContent = "Read More";
  readMore.href = "#";
  readMore.classList.add("read-more");

  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content");
  cardContent.append(movieTitle, movieDesc, readMore);

  movieListItem.append(moviePoster, cardContent);

  return movieListItem;
}

function renderMovies(movies, container) {
  container.innerHTML = "";
  movies.forEach((movie) => {
    const movieElement = createMovieElement(movie);
    container.appendChild(movieElement);
  });
}

async function initialize() {
  const url = "./api.json";
  const newList = await fetchMovies(url);

  renderMovies(newList, displayFilm);

  searchInput.addEventListener("keyup", function () {
    let inputValue = searchInput.value.toLowerCase();
    if (inputValue === "") {
      renderMovies(newList, displayFilm);
    } else {
      const filteredMovies = newList.filter((list) =>
        list.title.toLowerCase().includes(inputValue)
      );
      renderMovies(filteredMovies, displayFilm);
    }
  });
}

initialize();

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
