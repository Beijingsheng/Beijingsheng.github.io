//
// systemLog.js: defining the system logs to be uploaded
//

function recordNoteLog(blob, userID, time, videoID, timestamp) {
    // console.log(userID+"-"+videoID+"-"+time+"-recordedNote-"+timestamp+"-"+dateFormatting());
    uploadFileToCloud(userID+"-"+videoID+"-"+time+"-recordedNote-"+timestamp+"-"+dateFormatting(), blob);
    uploadMsgToCloud(userID+"-"+videoID + "-AddHistory-", videoID);
}

function labelUploaded(userID, time, videoID, timestamp, recognizedLabel) {
    // console.log(userID+"-"+videoID+"-"+dateFormatting()+"-labelSpeechRecognized-"+"-"+timestamp+"-"+time+"-"+recognizedLabel);
    uploadMsgToCloud(userID+"-"+videoID+"-"+dateFormatting()+"-labelSpeechRecognized-"+timestamp, userID+"-"+videoID+"-"+dateFormatting()+"-labelSpeechRecognized-"+"-"+timestamp+"-"+recognizedLabel);
}

function deleteNoteLog(userID, time, videoID, timestamp) {
    // console.log(userID+"-"+videoID+"-"+dateFormatting()+"-delete-"+timestamp+"-"+time);
    uploadMsgToCloud(userID+"-"+videoID+"-"+dateFormatting()+"-delete-"+"-"+timestamp+"-"+time, userID+"-"+videoID+"-"+dateFormatting()+"-delete-"+timestamp+"-"+time);
}

function clickedTimestampLog(userID, videoID, timestamp) {
    // console.log(userID+"-"+videoID+"-"+dateFormatting()+"-clickTimestamp-"+timestamp);
    uploadMsgToCloud(userID+"-"+videoID+"-"+dateFormatting()+"-clickTimestamp-"+timestamp, userID+"-"+videoID+"-"+dateFormatting()+"-clickTimestamp-"+timestamp);
}

function clickedPlayLog(userID, videoID, timestamp) {
    // console.log(userID+"-"+videoID+"-"+dateFormatting()+"-clickPlay-"+timestamp);
    uploadMsgToCloud(userID+"-"+videoID+"-"+dateFormatting()+"-clickPlay-"+timestamp, userID+"-"+videoID+"-"+dateFormatting()+"-clickPlay-"+timestamp);
}

function clickedLabelLog(userID, videoID, timestamp, enteredNote) {
    // console.log(userID+"-"+videoID+"-"+dateFormatting()+"-startChangeColor-"+timestamp+"-"+enteredNote);
    uploadMsgToCloud(userID+"-"+videoID+"-"+dateFormatting()+"-startChangeColor-"+timestamp, userID+"-"+videoID+"-"+dateFormatting()+"-startChangeColor-"+timestamp+"-"+enteredNote);
}

function setNewLabelLog(userID, videoID, timestamp, enteredNote, color) {
    // console.log(userID+"-"+videoID+"-"+dateFormatting()+"-ChangedColor-"+timestamp+"-"+enteredNote+"-"+color);
    uploadMsgToCloud(userID+"-"+videoID+"-"+dateFormatting()+"-ChangedColor-"+timestamp, userID+"-"+videoID+"-"+dateFormatting()+"-ChangedColor-"+timestamp+"-"+enteredNote+"-"+color);
}
