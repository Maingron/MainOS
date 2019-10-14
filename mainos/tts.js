var tts_objects = {};
var tts_which;
function make_tts() {
  tts_objects.mk1 = document.getElementsByClassName("tts_mk1");


  for (i = 0; i < tts_objects.mk1.length; i++) {
    tts_which = tts_objects.mk1[i];
    var output = "";
    for (j = 0; j < tts_which.children.length; j++) {
      output = output + tts_which.children[j].innerHTML;
    }
    tts_which.innerHTML = output;
  }

  if (document.getElementsByClassName("asktts")[0]) {
    tts_objects.asktts = document.getElementsByClassName("asktts")[0];
    tts_objects.asktts.innerHTML = "";
    tts_objects.asktts.outerHTML = "";
  }
}
make_tts();
