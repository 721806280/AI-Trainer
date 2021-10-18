let poseNet;
let pose;
let video;

function setup() {
    var myCanvas = createCanvas(640, 480);
    myCanvas.parent('booth');
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
}
function gotPoses(poses) {
    console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
      }
}
function draw() {
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    
    // for (let i = 0; i < pose.keypoints.length; i++) {
    //   let x = pose.keypoints[i].position.x;
    //   let y = pose.keypoints[i].position.y;
    //   fill(0,255,0);
    //   ellipse(x,y,16,16);
    // }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y,b.position.x,b.position.y);      
    }
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
// var stop = function () {
//     var stream = video.srcObject;
//     var tracks = stream.getTracks();
//     for (var i =0; i < tracks.length; i++) {
//         var track = tracks[i];
//         track.stop();
//     }
//     video.srcObject = null;
// } 
// var start = function () {
//     video = document.getElementById('video'), vendorUrl = window.URL || window.webkitURL;
//     if (navigator.mediaDevices.getUserMedia){
//         navigator.mediaDevices.getUserMedia({video: true})
//             .then(function (stream) {
//                 video.srcObject = stream;
//             }).catch(function (error) {
//                 console.log("Something went wrong!");
//             });
//     }
// }

// $(function () {
//     start();
// });
