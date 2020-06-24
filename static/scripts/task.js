//
// task.js: defining the task for each study.
//


// Constants for elements
testTaskButton = document.getElementById("testTask");
audioTaskButton1 = document.getElementById("audioTask1");
audioTaskButton2 = document.getElementById("audioTask2");
surveyButton1 = document.getElementById("survey1");
surveyButton2 = document.getElementById("survey2");

// Constants for Links
// Survey
s1 = "https://www.surveymonkey.com/r/GGF2TZJ";
s2 = "https://www.surveymonkey.com/r/GB2DN7K";
s3 = "https://www.surveymonkey.com/r/GBXR8JB";
s4 = "https://www.surveymonkey.com/r/GH2HDKC";
// Video
const astronomy = "9W3RsaWuCuE"; // Dark Matter: Crash Course Astronomy #41
const ml = "z-EtmaFJieY" // (CS) Machine Learning & Artificial Intelligence: Crash Course Computer Science #34
const organic = "UnuP4vrLvc4" // What Does "Organic" Mean, and Should You Buy Organic Foods?
const motivation = "9hdSLiHaJz8" // The Power of Motivation: Crash Course Psychology #17

// Constants for Tasks
// Test Video
var testvideo = "VeTeK9kvxyo";

// Step 1: Change Video
var video1 = ml;
var video2 = astronomy;
// Step 2: Change Task No. Label & Survey Label
var tasklabel1 = "2";
var tasklabel2 = "4";
var survey1 = s2;
var survey2 = s4;


testTaskButton.innerHTML = "Test Task"
function testTask() {
  window.location.href = "./app.html?https://you.tube/" + testvideo;
}
audioTaskButton1.innerHTML = "Task " + tasklabel1;
function audioTask1() {
  window.location.href = "./app.html?https://you.tube/" + video1;
}
surveyButton1.innerHTML = "Survey " + tasklabel1;
function survey1() {
  window.location.href = survey1;
}
audioTaskButton2.innerHTML = "Task " + tasklabel2;
function audioTask2() {
  window.location.href = "./app.html?https://you.tube/" + video2;
}
surveyButton2.innerHTML = "Survey " + tasklabel2;
function survey2() {
  window.location.href = survey2;
}
