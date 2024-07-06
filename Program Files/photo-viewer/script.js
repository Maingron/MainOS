var path = window.parent.attr;

console.log(window.parent.attr);


if (path) {
    document.querySelector("#photo").src = "#iofs:" + path;
    document.title += " - " + iofs.getInfos(path).name;

    if(iofs.getInfos(path).mime.category != "image") {
        document.querySelector("#errortext").innerHTML = "<p>(This doesn't seem like an image)</p>";
    } else {
        document.querySelector("#errortext").outerHTML = "";
    }

} else {
    document.querySelector("#photo").style.display = "none";
    document.querySelector("#errortext").innerHTML += "<p>... It seems like you didn't open a photo.</p>";
}
