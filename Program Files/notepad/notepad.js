var path = window.parent.attr;
var object = {}
object.savebutton = document.getElementById("savebutton");
object.filename1 = document.getElementById("filename1");
object.textcontent = document.getElementById("textcontent");
var objects = object;

if (path) {
    object.textcontent.value = iofs.load(path);
    object.savebutton.innerHTML = "Save as " + path;
    object.filename1.style.display = "none";
} else {
    object.filename1.style.display = "inline";
}

function savetextfile() {
    if (object.filename1.style.display == "none") {
        iofs.save(path, object.textcontent.value, "t=txt", 1);
    } else {
        iofs.save(filename1.value, object.textcontent.value, "t=txt", 1);
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
