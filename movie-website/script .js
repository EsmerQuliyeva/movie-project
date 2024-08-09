import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getDatabase,
  set,
  ref as databaseRef,
  remove,
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
const auth = getAuth(app);
const storage = getStorage(app);

const movieList = document.querySelector(".movie-list");
const movieListGeneral = document.querySelector(".movie-list-general");
const movieListSecond = document.querySelector(".movie-list-second");
const arrow = document.querySelector(".arrow");
const arrowSecond = document.querySelector(".arrow-second");

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
  const { title, poster_path, overview } = movie;

  const movieListItem = document.createElement("div");
  movieListItem.classList.add("movie-list-item");

  const moviePoster = document.createElement("img");
  moviePoster.classList.add("movie-list-item-img");
  moviePoster.src = poster_path;

  const movieTitle = document.createElement("p");
  movieTitle.classList.add("movie-list-item-title");
  movieTitle.textContent = title;

  const movieDesc = document.createElement("p");
  movieDesc.classList.add("movie-list-item-desc");
  movieDesc.textContent = overview;

  const movieBtn = document.createElement("button");
  movieBtn.classList.add("movie-list-item-button");
  movieBtn.textContent = "Watch";

  const saveIcon = document.createElement("a");
  saveIcon.classList.add("save-icon");
  saveIcon.innerHTML = `<i class="fa-regular fa-bookmark"></i>`;
  saveIcon.addEventListener("click", () => {
    try {
      if (saveIcon.innerHTML.includes("fa-regular")) {
        saveIcon.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;
        set(databaseRef(database, "movies/" + title), {
          title: title,
          desc: overview,
          poster: poster_path,
        });
      } else {
        saveIcon.innerHTML = `<i class="fa-regular fa-bookmark"></i>`;
        const movieRef = databaseRef(database, "movies/" + title);
        remove(movieRef);
      }
    } catch (error) {
      console.log("Error is:", error);
    }
  });

  movieListItem.appendChild(moviePoster);
  movieListItem.appendChild(saveIcon);
  movieListItem.appendChild(movieTitle);
  movieListItem.appendChild(movieDesc);
  movieListItem.appendChild(movieBtn);

  return movieListItem;
}

function renderMovies(movies, container) {
  movies.forEach((movie) => {
    const movieElement = createMovieElement(movie);
    container.appendChild(movieElement);
  });

  if (movies.length > 0) {
    const { title, overview, poster_path } = movies[4];
    const content = document.querySelector(".featured-content");
    const mainTitle = document.querySelector(".featured-title");
    const mainDesc = document.querySelector(".featured-desc");

    mainTitle.textContent = title;
    mainDesc.textContent = overview;
    content.style.backgroundImage = `url(${poster_path})`;
    content.classList.add("background");
  }

  const box = container.children;

  for (let i = 0; i < box.length; i++) {
    box[i].onclick = () => {
      const { title, overview, poster_path } = movies[i];
      const content = document.querySelector(".featured-content");
      const mainTitle = document.querySelector(".featured-title");
      const mainDesc = document.querySelector(".featured-desc");

      mainTitle.textContent = title;
      mainDesc.textContent = overview;
      content.style.backgroundImage = `url(${poster_path})`;
      content.classList.add("background");
    };
  }
}

function handleArrowClick(container, arrow) {
  const itemNumber = container.querySelectorAll("img").length;
  let clickCounter = 0;

  arrow.addEventListener("click", () => {
    clickCounter++;
    const ratio = Math.floor(window.innerWidth / 270);
    if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
      container.style.transform = `translateX(${
        container.computedStyleMap().get("transform")[0].x.value - 300
      }px)`;
    } else {
      container.style.transform = "translateX(0)";
      clickCounter = 0;
    }
  });
}

(async function initialize() {
  const url = "./api.json";
  const moviesList = await fetchMovies(url);

  renderMovies(moviesList, movieList);
  renderMovies(moviesList, movieListGeneral);
  renderMovies(moviesList, movieListSecond);

  handleArrowClick(movieList, arrow);
  handleArrowClick(movieListSecond, arrowSecond);
})();

const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
  ".container, .movie-list-title, .navbar-container, .sidebar, .left-menu-icon, .menu-list, .menu-list-item a, .toggle"
);
ball.addEventListener("click", () => {
  items.forEach((item) => {
    item.classList.toggle("active");
  });
  ball.classList.toggle("active");
});

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
