window.onload = function() {
	document.getElementById("link1").href = 'data:application/json,' + iofs.exportImage();
	document.getElementById("link1").download = "MainOS IOfs export - " + system.runtime.time().whatDate() + " " + system.runtime.time().whatTimeAndSeconds();
	document.getElementById("link1").removeAttribute("disabled");
	document.getElementById("link1").innerText = "Download IOfs image to PC";

	document.getElementById("link2").addEventListener("change", function() {
		let file = this.files[0];

		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent){
			var textFromFileLoaded = fileLoadedEvent.target.result;
			uploadedFile = textFromFileLoaded;
		};

		fileReader.readAsText(file, "UTF-8");
	});
}

var uploadedFile;

function startImport() {
	console.log(uploadedFile);
	iofs.importImage(uploadedFile, true);
	parent.window.location.reload();
}
