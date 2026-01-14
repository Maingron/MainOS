var path = window.parent.attr;

window.addEventListener("message", () => {
	if(event.data == "pWindowReady") {
		if (path) {
			document.querySelector("#photo").classList.add("loading");

			iofs.loadPromise(path, false).then(resultImage => {
				document.querySelector("#photo").classList.remove("loading");
				document.querySelector("#photo").src = resultImage;
				document.title += " - " + iofs.getInfos(path).name;
				
			});

			if(iofs.getInfos(path).mime.category != "image") {
				document.querySelector("#errortext").innerHTML = "<p>(This doesn't seem like an image)</p>";
			} else {
				document.querySelector("#errortext").outerHTML = "";
			}

		} else {
			document.querySelector("#photo").style.display = "none";
			document.querySelector("#errortext").innerHTML += "<p>... It seems like you didn't open a photo.</p>";
		}
	}
});
