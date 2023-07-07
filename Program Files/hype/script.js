var objects = {};
objects.videocall = document.getElementById("videocall");


function spawncam() {
  objects.videocall.innerHTML = "<video autoplay=\"true\" id=\"cam\"></video>";
  var video = document.getElementById("cam");
  if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
    .then(function(stream) {
      video.srcObject = stream;
    })
  }
}
