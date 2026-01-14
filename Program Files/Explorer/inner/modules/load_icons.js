function initLoadIcons() {
	attachedModules.push(loadIcons);

	loadIcons();
}

function loadIcons() {
	for(fileElement of document.getElementById("content_files").children) {
		var path = fileElement.attributes.path.value;
		let newIconElement = document.createElement("img");
		newIconElement.classList.add("icon");

		returnFileIconAsync(path).then((fileIconPath) => {
			newIconElement.setAttribute("src", fileIconPath);
		});

		fileElement.insertBefore(newIconElement, fileElement.firstChild);
		
		// Add folder overlay icon if this is a directory with a custom icon
		if(iofs.typeof(path) == "dir" && path.slice(-2) != ":/") {
			const customIcon = findFolderIcon(path);
			if (customIcon) {
				// Create overlay folder icon
				var overlayIconElement = document.createElement("img");
				overlayIconElement.classList.add("folder-overlay-icon");
				overlayIconElement.setAttribute("src", "#iofs:C:/system/icons/folder.svg");
				fileElement.insertBefore(overlayIconElement, fileElement.firstChild);
			}
		} else if(fileElement.getAttribute("linkedFile")) {
			// Create overlay link icon
			let overlayIconElement = document.createElement("img");
			overlayIconElement.classList.add("link-overlay-icon");
			overlayIconElement.setAttribute("src", "#iofs:C:/system/icons/shortcut.svg");
			fileElement.insertBefore(overlayIconElement, fileElement.firstChild);
		}
	}
}

function findFolderIcon(dirPath) {
	if(!pWindow?.settings?.showFolderCovers) {
		return false;
	}
	// Arrays of possible icon names and extensions to search for
	const iconNames = ["folder", "cover", "logo", "icon", "favicon"];
	const iconExtensions = ["jpg", "jpeg", "png", "svg", "bmp", "gif", "ico", "webp", "avif", "heic"];
	
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

function returnFileIconAsync(path) {
	return new Promise((resolve) => {
		let fileIconPath = returnPathForFileIcon(path);
		if(fileIconPath.startsWith("#iofs:")) {
			let fileIconPathSplit = fileIconPath.split("#iofs:")[1];
			iofs.loadPromise(fileIconPathSplit, false).then((resultImage) => {
				resolve(resultImage);
			});
		} else {
			resolve(fileIconPath);
		}
	});
}

function returnPathForFileIcon(path, useCustomIcon = true) {
	if(!iofs.exists(path)) {
		return "#iofs:C:/system/icons/broken_file.svg";
	}
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
	} else if(iofs.getInfos(path).mime.category == "image") {
		return "#iofs:" + path;
	} else if(fileending == ".run") {
		return JSON.parse(iofs.load(path)).icon;
	} else if(iofs.typeof(path) == "link") {
		if(iofs.getInfos(path).attributes["l$"]?.includes("0")) {
			return returnPathForFileIcon(iofs.getInfos(path).attributes["l"]);
		} else {
			return "#iofs:" + iofs.getInfos(path)?.icon;
		}
	}

	return "#iofs:" + iofs.getInfos(path)?.icon;
}

document.addEventListener("DOMContentLoaded", function() {
	initLoadIcons();
});
