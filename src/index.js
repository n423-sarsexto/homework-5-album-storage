import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  getDoc,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCB0QfRHa7_OwdF07I0_HuhhBrRG-Yv4Pc",
  authDomain: "data-summer-1d407.firebaseapp.com",
  projectId: "data-summer-1d407",
  storageBucket: "data-summer-1d407.appspot.com",
  messagingSenderId: "833912437982",
  appId: "1:833912437982:web:565ebbb971da7ec9d9d64f",
  measurementId: "G-GRLN9P52CW",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function addAlbumToDb() {
  if (
    $("#albumName").val() == "" ||
    $("#artistName").val() == "" ||
    $("#albumPhoto").val() == "" ||
    $("#genre").val() == ""
  ) {
    alert("Please fill out all fields.");
  } else {
    let album = {
      albumName: $("#albumName").val(),
      artistName: $("#artistName").val(),
      albumPhoto: $("#albumPhoto").val(),
      genre: $("#genre").val(),
    };

    addAlbum(album);
  }
}

async function addAlbum(album) {
  try {
    const docRef = await addDoc(collection(db, "Albums"), album);

    $(".add-album").css("display", "none");

    $("#albumName").val("");
    $("#artistName").val("");
    $("#albumPhoto").val("");
    $("#genre").val("");

    alert("Your album has been added!");
    getAllAlbumData();
  } catch (e) {
    console.log(e);
  }
}

async function getAllAlbumData() {
  const querySnapshot = await getDocs(collection(db, "Albums"));
  $("#app").html("");

  querySnapshot.forEach((doc) => {
    $("#searchSelection").html(`Viewing all albums`);
    $("#app").append(`<div class="album">
    <div class="albumImg"><img src="${doc.data().albumPhoto}"></div>
    <div class="albumInfo"><h2>${doc.data().albumName}</h2>
    <p>By ${doc.data().artistName}</p>
    <button class="genreTag" disabled>${doc.data().genre}</button></div>
    </div>`);
  });
}

async function queryData() {
  //query data by genre
  let genreSearch = $("#genrePick").val();

  if (genreSearch == "All") {
    getAllAlbumData();
  } else {
    const q = query(
      collection(db, "Albums"),
      where("genre", "==", genreSearch)
    );

    const querySnapshot = await getDocs(q);
    showSortedAlbums(querySnapshot);
  }
}

function showSortedAlbums(querySnapshot) {
  if (querySnapshot.docs.length > 0) {
    $("#app").html("");

    querySnapshot.forEach((doc) => {
      $("#searchSelection").html(`Viewing ${doc.data().genre} albums`);
      $("#app").append(`<div class="album">
    <div class="albumImg"><img src="${doc.data().albumPhoto}"></div>
    <div class="albumInfo"><h2>${doc.data().albumName}</h2>
    <p>By ${doc.data().artistName}</p>
    <button class="genreTag" disabled>${doc.data().genre}</button></div>
    </div>`);
    });
  } else {
    console.log("No data found");
  }
}

function initListeners() {
  $("#addAlbum").on("click", () => {
    $(".add-album").css("display", "block");
  });

  $("#closeAddAlbum").on("click", () => {
    $(".add-album").css("display", "none");
  });

  $("#genreSort").on("click", () => {
    queryData();
  });

  $("#submitAddAlbum").on("click", () => {
    addAlbumToDb();
  });
}

$(document).ready(function () {
  initListeners();

  getAllAlbumData();
});
