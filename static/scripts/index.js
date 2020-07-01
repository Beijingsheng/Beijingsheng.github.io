//
// index.js: handling the main page (video selection) of the app.
//



// Constants for Login
const enteredID = document.getElementById("IDInput"); // get element that contains userID
const displayID = document.getElementById("UserID");
const videoArea = document.getElementById("video-selection-area");
const loginArea = document.getElementById("login-area");
const historyCard = document.getElementById("his")

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

//Load History Contents Function
function loadHistory() {
  var firebaseConfig = {
    apiKey: "AIzaSyAKuLIV3WXcOs2udh2mbodDEzv3-fVOvPA",
    authDomain: "note-taking-audio.firebaseapp.com",
    databaseURL: "https://note-taking-audio.firebaseio.com",
    storageBucket: "note-taking-audio.appspot.com",
  };
  firebase.initializeApp(firebaseConfig);
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var listRef = storageRef.child('log');

  // Find all the prefixes and items.
  listRef.listAll().then(function(res) {
    res.items.forEach(function(itemRef) {
      // All the items under listRef.
      var cur = itemRef.toString()
      var inc_user = cur.includes(localStorage.getItem("UserID"))
      var inc_addH = cur.includes("AddHistory")
      if (inc_addH && inc_user) {
        var get_vID = cur.split(/\s*\-\s*/g)
        var vID = ''
        for (var i = 3; i < get_vID.length; i++) {
          vID = vID + get_vID[i]
          vID = vID + '-'
        }
        var l = vID.length
        vID = vID.substring(0, l - 17)
        
        let card = document.createElement('div');
        var a = document.createElement('a')
        let preview = document.createElement('img');

        card.style.width = '90%'
        card.style.padding = "10%"
        card.style.margin = "5%"

        var ref = "./app.html?https://you.tube/" + vID
        a.href = ref

        var s = "https://img.youtube.com/vi/" + vID + '/0.jpg'
        preview.src = s
        preview.style.width = '100%'
        
        a.appendChild(preview)
        card.appendChild(a)

        card.className = 'card shadow cursor-pointer';
        document.getElementById('his').appendChild(card)
      }
    });
  }).catch(function(error) {
    // Uh-oh, an error occurred!
  });
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
      console.log(videoId);
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


