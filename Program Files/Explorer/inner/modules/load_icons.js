function initLoadIcons() {
	attachedModules.push(loadIcons);

	loadIcons();
}

function loadIcons() {
	for(fileElement of document.getElementById("content_files").children) {
		var newIconElement = document.createElement("img");
		newIconElement.classList.add("icon");
		newIconElement.setAttribute("src", returnPathForFileIcon(fileElement.attributes.path.value));
		fileElement.insertBefore(newIconElement, fileElement.firstChild);
	}
}

function returnPathForFileIcon(path) {
	var fileending = path.slice(path.lastIndexOf("."));

	if(isfolder(path)) {
		if(path.slice(-2) == ":/") {
			return "iofs:C:/mainos/system32/icons/mainos_folder.svg";
		} else {
			return "iofs:C:/mainos/system32/icons/folder.svg";
		}
	}

	if ([".txt", ".log"].includes(fileending)) {
		return "iofs:C:/Program Files/notepad/icon.png";
	} else if ([".png", ".jpg", ".jpeg", ".svg"].includes(fileending)) {
		return "iofs:" + path;
	} else if (fileending == ".run") {
		return JSON.parse(loadfile(path)).icon;
	}

	// Default icon
	return "iofs:C:/mainos/system32/icons/unknown_file.svg";
}

document.addEventListener("DOMContentLoaded", function() {
	initLoadIcons();
});