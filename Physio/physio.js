let poseNet;
let pose;

function setup() {
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
}
function gotPoses(poses) {
    console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
    }
}
function draw() {
    image(video, 0, 0);

    if (pose) {
        fill(255,0,0);
        ellipse(pose.nose.x, pose.nose.y, 64);
    }
}
function modelLoaded(params) {
    console.log('poseNet ready');
}
// Redirection
function contactRedirect() {
    window.location.href = "contact.html";
}
function physioRedirect() {
    window.location.href = "physio.html";
}

// Gaining live camera access
var stop = function () {
    var stream = video.srcObject;
    var tracks = stream.getTracks();
    for (var i =0; i < tracks.length; i++) {
        var track = tracks[i];
        track.stop();
    }
    video.srcObject = null;
} 
var start = function () {
    var video = document.getElementById('video'), vendorUrl = window.URL || window.webkitURL;
    if (navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video: true})
            .then(function (stream) {
                video.srcObject = stream;
            }).catch(function (error) {
                console.log("Something went wrong!");
            });
    }
}

// $(function () {
//     start();
// });
