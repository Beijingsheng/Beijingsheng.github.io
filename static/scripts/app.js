//
// app.js: the main file for all functionalities in the App.
//

// Audio Recording Constants
var gumStream;    // stream from getUserMedia()
var rec;          // Recorder.js object
var input;        // MediaStreamAudioSourceNode we'll be recording
var AudioContext = window.AudioContext || window.webkitAudioContext; // shim for AudioContext when it's not available.
var audioContext; // audio context to help us record


// Buttons Constants
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var timeLabel = document.getElementById("timeLabel");
var unmuteButton = document.getElementById("unmuteButton");
var unmuteButtonImg = document.getElementById('unmuteButtonImg');
var downloadButton = document.getElementById("downloadButton");
var colorLabelDoneButton = document.getElementById("colorLabelDone");
var doneButton = document.getElementById('finalDone');

// IndexedDB Constants
URL = window.URL || window.webkitURL; // webkitURL is deprecated but nevertheless
const table = document.querySelector('#audioNoteList');
var blobToSave;
var audioToSave;
var currentTimestamp;
var recordTime;
var counter = 1;

// localStorage Constants (for Login and identification)
const displayUserId = document.getElementById("displayUserId");
const realAppUserID = localStorage.getItem("UserID"); // appUserID
const appUserID = realAppUserID.substring(0,realAppUserID.length-6);
if (appUserID != null) {
  displayUserId.innerHTML = appUserID;
} else {
  alert("Please enter an User ID!");
  window.location.href = "index.html";
}

// Queue Object for processing speech recognition result.
const queueSpeechResult = {};
var speechRecogLabel = "";
var timestampID = "";

// YouTube Embedded Video Loading Constants
var rawURL = window.location.href.toString();
var pieces = rawURL.split(/[\s/]+/);
var videoID = pieces[pieces.length-1];
videoId.innerHTML = videoID;

// Color Label Constants
var changeColorTargetID = "";
var changeTimestampButton;
var changePlayAudioButton;
var changeColorLabelButton;

window.onload = function() {
  recordButton.addEventListener("click", startRecording);
  stopButton.addEventListener("click", stopRecording);
  unmuteButton.addEventListener("click", unmute);
  colorLabelDoneButton.addEventListener("click", doneSelectColor);
  doneButton.setAttribute("data-toggle", "modal");
  doneButton.setAttribute("data-target", "#finalBox");

  // For Testing on Desktop devices:
  // Hold and release space key to trigger note recording.
  //
  // var shouldHandleKeyDown = true;
  // document.body.onkeydown = function(e){
  //   if(e.keyCode == 32){
  //     if(!shouldHandleKeyDown) return;
  //     shouldHandleKeyDown = false;
  //     //your code
  //     console.log("Space Key Pressed.");
  //     startRecording(e);
  //   }
  // }
  // document.body.onkeyup = function(e){
  //   if(e.keyCode == 32){
  //     shouldHandleKeyDown = true;
  //     //your code
  //     console.log("Space Key Released.");
  //     stopRecording(e);
  //   }
  // }

  //
  // IndexedDB initializing
  //
  let request = window.indexedDB.open('ant_db', 1);

  request.onerror = function() {
    console.log('Database failed to open');
  }
  request.onsuccess = function() {
    console.log('Database opened successfully');
    db = request.result;
    displayData();
  }
  request.onupgradeneeded = function(e) {
    let db = e.target.result;

    // Create an objectStore to store our notes in (basically like a single table)
    let objectStore = db.createObjectStore('ant_os', { keyPath: 'id', autoIncrement:true });

    // Define what data items the objectStore will contain
    objectStore.createIndex('videoID', 'videoID', { unique: false });
    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
    objectStore.createIndex('label', 'label', { unique: false });
    objectStore.createIndex('audio', 'audio', { unique: false });
    objectStore.createIndex('color', 'color', { unique: false });
    objectStore.createIndex('time', 'time', { unique: false });

    console.log('Database setup complete');
  }

  // addData(): create new item in IndexedDB whenever a new note is taken.
  function addData(e) {
    console.log("add Data to DB");
    console.log(e);
    e.preventDefault();
    let newItem = { videoID: videoID, timestamp: currentTimestamp, label: "loading...", color: "grey", audio: audioToSave, time: recordTime };
    let transaction = db.transaction(['ant_os'], 'readwrite');
    let objectStore = transaction.objectStore('ant_os');
    let request = objectStore.add(newItem);
    request.onsuccess = function() {
      queueSpeechResult[currentTimestamp] = request.result;
      // console.log(queueSpeechResult);
    };
    transaction.oncomplete = function(e) {
      console.log('Transaction completed: database modification finished.');

      // when adding item complete, update the display of data to show the newly added item.
      displayData();
    };
    transaction.onerror = function() {
      console.log('Transaction not opened due to error');
    };
  }

  // changeLabelColor: detecting when the note's color label button is clicked.
  function changeLabelColor(elem) {
    // get the id of the entry, and save it
    changeColorLabelButton = elem.target;
    changeTimestampButton = elem.target.parentNode.parentNode.querySelectorAll('button')[0];
    changePlayAudioButton = elem.target.parentNode.parentNode.querySelectorAll('button')[1];
    changeColorTargetID = elem.target.parentNode.parentNode.getAttribute("data-note-id");
    console.log(changeTimestampButton);
    console.log(changeColorTargetID);
    console.log(changeColorLabelButton.classList[1]);

    // checked the radio
    document.getElementById(changeColorLabelButton.classList[1]).checked = true;

    // Upload log of changing Color
    clickedLabelLog(realAppUserID, videoID, elem.target.parentNode.parentNode.querySelectorAll('td')[0].querySelector('button').innerHTML,  elem.target.parentNode.parentNode.querySelectorAll('td')[3].querySelectorAll('a')[0].innerHTML);
  }

  // doneSelectColor: After selecting the color, 1) update the element 2) save it to the indexeddb
  function doneSelectColor() {
    // Step 1. update the elements
    var targetColor = "";
    changeColorLabelButton.classList.remove(changeColorLabelButton.classList[1]);
    changeTimestampButton.classList.remove(changeTimestampButton.classList[1]);
    changePlayAudioButton.classList.remove(changePlayAudioButton.classList[1]);
    console.log(changeColorLabelButton.classList);
    if (document.getElementById("red").checked == true) {
      targetColor = "red";
      changeColorLabelButton.classList.add("red");
      changeTimestampButton.classList.add("red");
      changePlayAudioButton.classList.add("red");
    } else if (document.getElementById("orange").checked == true) {
      targetColor = "orange";
      changeColorLabelButton.classList.add("orange");
      changeTimestampButton.classList.add("orange");
      changePlayAudioButton.classList.add("orange");
    } else if (document.getElementById("yellow").checked == true) {
      targetColor = "yellow";
      changeColorLabelButton.classList.add("yellow");
      changeTimestampButton.classList.add("yellow");
      changePlayAudioButton.classList.add("yellow");
    } else if (document.getElementById("green").checked == true) {
      targetColor = "green";
      changeColorLabelButton.classList.add("green");
      changeTimestampButton.classList.add("green");
      changePlayAudioButton.classList.add("green");
    } else if (document.getElementById("blue").checked == true) {
      targetColor = "blue";
      changeColorLabelButton.classList.add("blue");
      changeTimestampButton.classList.add("blue");
      changePlayAudioButton.classList.add("blue");
    } else if (document.getElementById("purple").checked == true) {
      targetColor = "purple";
      changeColorLabelButton.classList.add("purple");
      changeTimestampButton.classList.add("purple");
      changePlayAudioButton.classList.add("purple");
    } else if (document.getElementById("grey").checked == true) {
      targetColor = "grey";
      changeColorLabelButton.classList.add("grey");
      changeTimestampButton.classList.add("grey");
      changePlayAudioButton.classList.add("grey");
    }
    console.log("targetColor: "+targetColor);

    // Step 2. upload the color label to the item in indexeddb using the ID
    var objectStore = db.transaction(["ant_os"], "readwrite").objectStore("ant_os");
    var request = objectStore.get(parseInt(changeColorTargetID));
    request.onerror = function(event) {
      console.log("request data for modify label error")
    };
    request.onsuccess = function(event) {
      // Get the old value that we want to update
      var data = event.target.result;
      // console.log(event);

      // Update the value(s) in the object that you want to change
      data.color = targetColor;

      // Put this updated object back into the database.
      var requestUpdate = objectStore.put(data);
      requestUpdate.onerror = function(event) {
        console.log("update color error")
      };
      requestUpdate.onsuccess = function(event) {
        console.log("update color success")
      };
    };
    // upload log of changing color
    setNewLabelLog(realAppUserID, videoID, changeColorLabelButton.parentNode.parentNode.querySelectorAll('td')[0].querySelector('button').innerHTML, changeColorLabelButton.parentNode.parentNode.querySelectorAll('td')[3].querySelectorAll('a')[0].innerHTML, targetColor);

  }

  // displayData(): Load all the items from indexedDB and display them in list.
  function displayData() {
    var counter = 1;
    console.log("display Data");
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
    let objectStore = db.transaction('ant_os').objectStore('ant_os');
    objectStore.openCursor().onsuccess = function(e) {
      let cursor = e.target.result;
      if(cursor) {
        // switch to display only the notes related to current video (based on video ID)
        if(cursor.value.videoID == videoID) {
          // Create a table item
          var tr = document.createElement('tr');
          var th = document.createElement('th');
          var btn_td = document.createElement('td');
          var au_td = document.createElement('td');
          var time_td = document.createElement('td');
          var delete_td = document.createElement('td');
          var color_td = document.createElement('td');

          // Create elements
          var au = document.createElement('audio');
          var navBtn = document.createElement('button')
          var link = document.createElement('a');
          var br = document.createElement('br');
          var label = document.createElement('a');
          var colorBtn = document.createElement('button');
          var playBtn = document.createElement("button");
          var isPlaying = false;
          var playTimestamp;
          var playBtnImg = document.createElement("img");

          tr.appendChild(th);
          tr.appendChild(btn_td);
          tr.appendChild(au_td);
          tr.appendChild(color_td);
          tr.appendChild(time_td);
          tr.appendChild(delete_td);
          table.appendChild(tr);

          // Append all items to table
          th.scope = "row";
          th.innerHTML = counter;
          counter += 1;
          btn_td.appendChild(navBtn);
          color_td.appendChild(colorBtn);
          playBtn.appendChild(playBtnImg);
          au_td.appendChild(playBtn);
          time_td.appendChild(label);
          time_td.appendChild(br);
          time_td.appendChild(link);

          // playBtn: Audio Play Button
          playBtnImg.setAttribute("id", "playNoteButtonImg");
          playBtnImg.setAttribute("src", "images/icons8-play-100.png");
          playBtnImg.setAttribute("style", "height: 20px;");

          var url = URL.createObjectURL(dataURItoBlob(cursor.value.audio));
          au.controls = false;
          au.src = url;

          au.onplaying = function() {
            playBtnImg.src = "images/icons8-stop-100.png";
            // playBtn.textContent = "Stop";
  	        isPlaying = true;
          };
          au.onpause = function() {
            playBtnImg.src = "images/icons8-play-100.png";
            // playBtn.textContent = "Play";
            isPlaying = false;
          };
          playBtn.addEventListener("click", playAudio);
          playBtn.setAttribute("class", "btn " + cursor.value.color);
          // playBtn.innerHTML = "Play";
          function playAudio(e) {
            if (isPlaying){
              au.pause();
              au.currentTime = 0;
            } else {
              au.play();
              player.pauseVideo();
              console.log(e.target);
              // upload log
              var playAudioTimestamp = cursor.value.timestamp;
              clickedPlayLog(realAppUserID, videoID, playAudioTimestamp);
            }
          }

          // navBtn: Timestamp Navigation Button
          navBtn.innerHTML = timeFormatting(cursor.value.timestamp); // change timestamp
          navBtn.setAttribute("class", "btn " + cursor.value.color);
          navBtn.setAttribute("style", "color:#ffffff;");
          playTimestamp = cursor.value.timestamp;
          navBtn.addEventListener("click", function(event) {
            navigateVideoAtTime(playTimestamp);
            console.log(playTimestamp);
            au.play();
            au.addEventListener("ended", function(e) {
              player.unMute();
              unmuteButtonImg.src = "images/icons8-audio-100.png";
            }, false)
          });

          // colorBtn: Change color label Button
          colorBtn.setAttribute("style", "height: 38px; width: 25px;");
          colorBtn.setAttribute("class", "btn " + cursor.value.color);
          colorBtn.setAttribute("data-toggle", "modal");
          colorBtn.setAttribute("data-target", "#colorLabelBox");
          colorBtn.addEventListener("click", function(event) {
            changeLabelColor(event);
          });
          // au.play();

          // label: Text Label of note (The Note / Audio Recogntion Result)
          label.textContent = cursor.value.label;

          // link: Audio File Download Link
          var filename = cursor.value.time;
          link.href = url;
        	link.download = filename+".wav";
          var dispRes = filename.split("-");
        	link.innerHTML = dispRes[3]+":"+dispRes[4]+":"+dispRes[5]+", "+dispRes[0]+"/"+dispRes[1]+"/"+dispRes[2]; // 03/29/2020, 02:35:19

          // Set id of the data item inside the table
          tr.setAttribute('data-note-id', cursor.value.id);

          // delete: delete button of the item
          const deleteBtn = document.createElement('button');
          var deleteBtnImg = document.createElement("img");
          delete_td.appendChild(deleteBtn);

          deleteBtnImg.setAttribute("id", "deleteBtnImg");
          deleteBtnImg.setAttribute("src", "images/icon-trash-bin.png");
          deleteBtnImg.setAttribute("style", "height: 20px; background: url(images/icon-trash-bin.png)");
          deleteBtn.textContent = 'Del';
          deleteBtn.setAttribute("class", "btn btn-danger btn-sm");
          deleteBtn.onclick = deleteItem;
        }
        // Iterate to the next item in the cursor
        cursor.continue();
      } else {
        // Again, if list item is empty, display a 'No notes stored' message
        if(!table.firstChild) {
          let empty_tr = document.createElement('tr');
          let empty_th = document.createElement('tr');
          empty_th.textContent = 'No notes stored.';
          table.appendChild(empty_tr);
          table.appendChild(empty_th);
        }
        console.log('Notes all displayed');
      }
    };
  }
  // deleteItem(): delete the given note entry
  function deleteItem(e) {
    let noteId = Number(e.target.parentNode.parentNode.getAttribute('data-note-id'));
    console.log(e.target.parentNode.parentNode.parentNode);
    let transaction = db.transaction(['ant_os'], 'readwrite');
    let objectStore = transaction.objectStore('ant_os');
    let object = objectStore.get(noteId);
    let request = objectStore.delete(noteId);
    transaction.oncomplete = function() {
      e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
      console.log('Note ' + noteId + ' deleted.');

      // Upload delete message to Server
      deleteNoteLog(realAppUserID, object.result.time, videoID, object.result.timestamp);
    }
    if(!table.firstChild) {
      let empty_tr = document.createElement('tr');
      let empty_th = document.createElement('tr');
      empty_th.textContent = 'No notes stored.';
      table.appendChild(empty_tr);
      table.appendChild(empty_th);
    }
  }

  //
  // Recording function
  //
  var constraints = { audio: true, video:false };
  function startRecording(event) {
    if (event) {
      console.log(event);
      // recordButton.addEventListener("pointerout", stopRecording);

      currentTimestamp = player.getCurrentTime();
      recordTime = dateFormatting();
      player.pauseVideo();
      player.mute();
      unmuteButtonImg.src = "images/icons8-no-audio-100.png";
    	console.log("recordButton clicked");
      console.log("------------------"+currentTimestamp);

      navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        audioContext = new AudioContext();
        gumStream = stream;
        input = audioContext.createMediaStreamSource(stream);

        

        rec = new Recorder(input,{numChannels:1});
        rec.record()

        console.log("Recording started");
        timeLabelDisplay();

      }).catch(function(err) {
          // enable the record button if getUserMedia() fails
          console.log("failed start recording");
          console.log(err);
          recotdButton.style.display = "block";
          stopButton.style.display = "none";
      });
    }
  }
  function stopRecording(event) {
    if (event) {
      recordButton.removeEventListener("pointerout", stopRecording);
    	console.log("stopButton clicked");
      timeLabelDisplay();

      rec.stop();
      audioContext.close();
    	gumStream.getAudioTracks()[0].stop();

      // After recording done, resume playing video
      var unmuteButtonImg = document.getElementById('unmuteButtonImg');
      player.unMute();
      unmuteButtonImg.src = "images/icons8-audio-100.png";
      player.playVideo();

      // Export the result and update it in the IndexedDB
      rec.exportWAV(saveBlob);
    }
  }
  function saveBlob(blob) {
    console.log("saving blob" + blob);
    let eventObject = event;
    // saving speech recognition timeLabel
    blobToSave = blob;
    let timeStampToSave = currentTimestamp;

    // convert blob to base64
    // *  this additional step was to address the issue
    //    of incompatibility of saving blobs in IndexedDB in
    //    certain browsers (e.g. Safari on iOS)

    var reader = new FileReader();
    var resultDataURL;
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      var base64data = reader.result;
      // console.log(base64data);
      resultDataURL = base64data.toString();
      // console.log(dataURItoBlob(resultDataURL));
      audioToSave = base64data.toString();
      // Add data to DB.
      addData(event);
    }

    // Upload files to Server
    recordNoteLog(blob, realAppUserID, recordTime, videoID, currentTimestamp);
    console.log(realAppUserID+"-"+recordTime+"-upload-"+videoID+"-"+currentTimestamp+"-"+dateFormatting());

    // Pass blob to speechRecognition
    fetch('/api/speech-to-text/token').then(function(response) {
      //alert('token fetched');
      return response.json();
    }).then(function (token, event) {


      //alert('start to create stream');
      var stream = WatsonSpeech.SpeechToText.recognizeFile(Object.assign(token, {
        file: blob,
        extractResults: true,
        interimResults: false,
        // outputElement: '#output', // CSS selector or DOM Element (optional)
        continuous: false,
        timestamp: timeStampToSave
      }));
      //alert('stream created succesfully');
      console.log(stream);
      console.log(typeof(stream));

      stream.on('error', function(err) {
          console.log(err);
      });

      stream.on('readable', function(event) {
          if (stream._readableState.buffer.head != null) {
            console.log(stream._readableState.buffer.head.data.alternatives[0].transcript);
            console.log(stream.recognizeStream.options.timestamp);
            addLabelData(stream._readableState.buffer.head.data.alternatives[0].transcript, stream.recognizeStream.options.timestamp);
            //alert('data converted');
          } else {
            console.log("Audio appears to be empty");
            addLabelData("", stream.recognizeStream.options.timestamp);
            //alert('empty audio');
          }
          console.log(stream);
      });

    }).catch(function(error) {
        console.log(error);
    });
  }
  // convert base64 to raw binary data held in a string
  function dataURItoBlob(dataURI) {
    console.log(dataURI);
    var byteString = atob(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0] // separate out the mime component
    var ab = new ArrayBuffer(byteString.length); // write the bytes of the string to an ArrayBuffer
    var ia = new Uint8Array(ab); // create a view into the buffer

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;

  }

  function addLabelData(speechLabel, targetTimestamp) {
    // STEP1: get the timestamp & speechlabel, match timestamp and get the ID
    var addID = queueSpeechResult[targetTimestamp];
    console.log(speechLabel);
    console.log(targetTimestamp);
    console.log(addID);

    // STEP2: add the data using the id from the first item, check if successful
    var objectStore = db.transaction(["ant_os"], "readwrite").objectStore("ant_os");
    var request = objectStore.get(addID);
    request.onerror = function(event) {
      console.log("request data for modify label error")
    };
    request.onsuccess = function(event) {
      var data = event.target.result; // Get the old value that we want to update
      data.label = speechLabel; // update the value(s) in the object that you want to change
      var requestUpdate = objectStore.put(data); // Put this updated object back into the database.
      requestUpdate.onerror = function(event) {
        console.log("update label error")
      };
      requestUpdate.onsuccess = function(event) {
        console.log("update label success")
        // STEP3: use the id from the first item to change the HTML from "loading..." to speechLabel.
        var updateLabelTarget = document.querySelector("tr[data-note-id='"+addID+"']");
        updateLabelTarget.getElementsByTagName("a")[0].innerHTML = speechLabel;
        labelUploaded(realAppUserID, updateLabelTarget.querySelectorAll('a')[1].innerHTML, videoID, targetTimestamp, speechLabel);
      };
    };
  }

  function timeFormatting(rawSeconds) {
    var min = Math.floor(rawSeconds/60);
    var second = Math.floor(rawSeconds - (60 * min));
    var secondString;
    // second toString
    if (second < 10) {
      secondString = "0" + second.toString();
    } else {
      secondString = second.toString();
    }
    var result = min.toString() + ":" + secondString;
    return result;
  }
}


//
// YouTube iframe API Video Loading
//
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: videoID,
    events: {
      'onReady': onPlayerReady,
      'onError': onPlayerError
    },
    playerVars: {
      playsinline: 1
    }
  });
}
function onPlayerReady(event) {
  // detect if mobile
  var deviceType = navigator.platform;
  var iframeTag = document.getElementById("player");
  if (deviceType.toUpperCase().startsWith("WIN") || deviceType.toUpperCase().startsWith("MAC")) {
    iframeTag.setAttribute("style", "height: 60vh;")
  } else {
    iframeTag.setAttribute("style", "height: 32vh;")
  }
  event.target.playVideo();
}
// if video loading error, go back to the last onPlayerStateChange
function onPlayerError() {
  console.log("a");

  window.location.href = "index.html";
  alert("Please check the video link again.");
}

function stopVideo() {
  player.stopVideo();
}

//
// Other Functions
//

// Note-taking Mode:
// When change orientation of device to horizontal, hide the note list.
window.addEventListener("orientationchange", function() {
    // Announce the new orientation number
    var targetClass = document.getElementsByTagName("iframe");
    var table = document.getElementsByTagName("table");

    if (window.innerWidth > window.innerHeight) {
      // if horizontal, 1) hide table. 2) contains the button in full screenshot.
      targetClass[0].setAttribute("style", "height:32vh;");
      table[0].style.display = "block";
    } else if (window.innerWidth < window.innerHeight) {
      // if vertical, 1) show table 2) change back to whatever the original is.
      targetClass[0].setAttribute("style", "height:90vh;");
      table[0].style.display = "none";
    }
}, false);


// Asking for microphone permissions when initiating the app
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    console.log('Microphone Permission: Permission Granted.')
  })
  .catch(function(err) {
    console.log('Microphone Permission: Failed Granting Permission.')
  });

// Timestamp Button Navigate function
function navigateVideoAtTime(timestamp) {
  var unmuteButtonImg = document.getElementById('unmuteButtonImg');
  player.seekTo(timestamp, true);
  player.playVideo();
  // unmute();
  player.mute();
  unmuteButtonImg.src = "images/icons8-no-audio-100.png";

  // upload log
  clickedTimestampLog(realAppUserID, videoID, timestamp);
}

// Mute Button Display
function unmute(){
  if(player.isMuted()) {
    player.unMute();
    unmuteButtonImg.src = "images/icons8-audio-100.png";
  } else {
    player.mute();
    unmuteButtonImg.src = "images/icons8-no-audio-100.png";
  }
}

// Date formatting for fileName of audio recording
function dateFormatting() {
  var now = new Date();
  var dd = now.getDate();
  var mm = now.getMonth()+1;
  var yyyy = now.getFullYear();
  var hh = now.getHours();
  var mn = now.getMinutes();
  var ss = now.getSeconds();
  function format(time) {
    if(time<10) {
      time='0'+time;
    }
    return time;
  }
  now = format(mm)+"-"+format(dd)+"-"+yyyy+"-"+format(hh)+"-"+format(mn)+"-"+format(ss);
  return now;
}
