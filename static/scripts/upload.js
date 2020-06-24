//
// upload.js: handling upload functions for all the data log.
//

// Set the configuration for your app
// TODO: Replace with your app's config object
var firebaseConfig = {
  apiKey: "AIzaSyAKuLIV3WXcOs2udh2mbodDEzv3-fVOvPA",
  authDomain: "note-taking-audio.firebaseapp.com",
  databaseURL: "https://note-taking-audio.firebaseio.com",
  projectId: "note-taking-audio",
  storageBucket: "note-taking-audio.appspot.com",
  messagingSenderId: "816299169672",
  appId: "1:816299169672:web:b21bbb75e1431b1d1bcc3d",
  measurementId: "G-MECTHWQJ7F"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();

// Create a Storage Ref
var storageRef = storage.ref();


// Upload files
function uploadFileToCloud(fileName, file) {
  storageRef = storage.ref("log/"+fileName+".wav");
  storageRef.put(file).then(function(snapshot) {
    console.log("recording file uploaded!");
  });
  storageRef = storage.ref();
}

// Upload delete message
// Upload delete message to Server
function uploadMsgToCloud(filename, message) {
  storageRef = storage.ref("log/"+filename+".txt");
  var file = new Blob([message], {type: "text/plain;charset=utf-8"});
  storageRef.put(file).then(function(){
    console.log(message);
  });
  storageRef = storage.ref();
}
