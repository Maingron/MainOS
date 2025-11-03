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

function findFolderIcon(dirPath) {
	// Arrays of possible icon names and extensions to search for
	const iconNames = ["folder", "cover", "logo", "icon", "favicon"];
	const iconExtensions = ["jpg", "jpeg", "png", "svg", "bmp"];
	
	// Get all files in the directory
	const filesInDir = iofs.listdir(dirPath, 0);
	
	// Search for icon files by combining names and extensions
	for (let name of iconNames) {
		for (let ext of iconExtensions) {
			const iconFilename = name + "." + ext;
			const iconPath = dirPath + "/" + iconFilename;
			
			// Check if this icon file exists in the directory
			if (filesInDir.includes(iconPath)) {
				return "#iofs:" + iconPath;
			}
		}
	}
	
	// No custom icon found
	return null;
}

function returnPathForFileIcon(path, useCustomIcon = true) {
	let filename = iofs.getName(path);
	var fileending = filename.slice(filename.lastIndexOf("."));

	if(iofs.typeof(path) == "dir") {
		if(path.slice(-2) == ":/") {
			return "#iofs:C:/system/icons/mainos_folder.svg";
		} else {
			// Check for custom folder icon (only if useCustomIcon is true)
			if (useCustomIcon) {
				const customIcon = findFolderIcon(path);
				if (customIcon) {
					return customIcon;
				}
			}
			return "#iofs:C:/system/icons/folder.svg";
		}
	}

	if ([".txt", ".log"].includes(fileending)) {
		return "#iofs:C:/Program Files/notepad/icon.png";
	} else if ([".png", ".jpg", ".jpeg", ".svg"].includes(fileending)) {
		return "#iofs:" + path;
	} else if (fileending == ".run") {
		return JSON.parse(iofs.load(path)).icon;
	}

	// Default icon
	return "#iofs:C:/system/icons/unknown_file.svg";
}

document.addEventListener("DOMContentLoaded", function() {
	initLoadIcons();
});
