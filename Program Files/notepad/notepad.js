var path = window.parent.attr;
var object = {}
object.savebutton = document.getElementById("savebutton");
object.filename1 = document.getElementById("filename1");
object.textcontent = document.getElementById("textcontent");
var objects = object;

if (path) {
  object.textcontent.value = window.parent.loadfile(path);
  object.savebutton.innerHTML = "Save as " + path;
  object.filename1.style.display = "none";
} else {
  object.filename1.style.display = "inline";
}

function savefile() {
  if (object.filename1.style.display == "none") {
    window.parent.savefile(path, object.textcontent.value, 1);
  } else {
    window.parent.savefile(filename1.value, object.textcontent.value, 1);
  }
}

setInterval(function () {
  if (objects.textcontent.value.includes("font=")) {
    objects.textcontent.style.fontFamily = objects.textcontent.value.split("font=")[1].split(";")[0];
  }
  if (objects.textcontent.value.includes("fontsize=")) {
    objects.textcontent.style.fontSize = objects.textcontent.value.split("fontsize=")[1].split(";")[0];
  }

}, 100);

if (objects.textcontent.value.includes("font=")) {
  objects.textcontent.style.fontFamily = objects.textcontent.value.split("font=")[1].split(";")[0];
}
if (objects.textcontent.value.includes("fontsize=")) {
  objects.textcontent.style.fontSize = objects.textcontent.value.split("fontsize=")[1].split(";")[0];
}


document.documentElement.style.setProperty("--font", window.parent.setting.font);