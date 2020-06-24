//
// index.js: handling the main page (video selection) of the app.
//


// Constants for Login
const enteredID = document.getElementById("IDInput"); // get element that contains userID
const displayID = document.getElementById("UserID");
const videoArea = document.getElementById("video-selection-area");
const loginArea = document.getElementById("login-area");

// Constants for Video selection
var videoId = "";
var ytlink = "";

// Display different view based on Login Status.
// (check if UserID exists, if not, hide "video-selection" and display "login".)
window.onload = function() {
  console.log("file loaded");
  if (localStorage.getItem("UserID") == null) {
    displayLogin();
  } else {
    displayVideoSelection();
  }
}


// Login Functions
function basicLogin() {
  if (enteredID.value != "") {
    localStorage.setItem("UserID", enteredID.value + '_' + Math.random().toString(36).substr(2, 5));
  } else {
    alert("Please enter an UserID.");
  }
}
function basicLogout() {
  localStorage.removeItem("UserID");
}

// View Display Functions
function displayVideoSelection() {
  var displayUserID = localStorage.getItem("UserID");
  displayID.innerHTML = displayUserID.substring(0, displayUserID.length-6)
  videoArea.style.display = "block";
  loginArea.style.display = "none";
}
function displayLogin() {
  videoArea.style.display = "none";
  loginArea.style.display = "block";
}


// Video Selection Functions
function start() {
  try {
    if(ytlink == ""){
      ytlink = document.getElementById("videoInput").value;
      videoId = ytlink.substring(ytlink.length - 11);
      // console.log(videoId);
      window.location.href = "./app.html?https://you.tube/" + videoId;
      videoId = "";
      ytlink = "";
    } else {
      alert("Please enter a valid video link.");
    }
  } catch(err) {
    console.log("error loading video. check link.");
  }
}
