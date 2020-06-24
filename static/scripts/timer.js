//
// timer.js: for handling the display of timer label on the recording button.
// 

var timeLabel = document.getElementById("timeLabel");
var recordButton = document.getElementById("recordButton");
var timeString = "";
var totalSeconds = 0;
var timerRunning;

function timeLabelDisplay() {
  if (timeLabel.innerHTML === "--:--") {
    recordButton.style.display = "none";
    stopButton.style.display = "block";
    timerRunning = setInterval(setTime, 1000);
    totalSeconds = 0;
    recordButton.innerHTML = "Recording...";
    timeLabel.innerHTML = "00:00";
  } else {
    clearInterval(timerRunning);
    recordButton.innerHTML = "Record Note";
    timeLabel.innerHTML = "--:--";
    stopButton.style.display = "none";
    recordButton.style.display = "block";
    return;
  }
}

function setTime() {
  console.log(totalSeconds);
  ++totalSeconds;
  timeLabel.innerHTML = pad(parseInt(totalSeconds / 60)) + ":" + pad(totalSeconds % 60);
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
