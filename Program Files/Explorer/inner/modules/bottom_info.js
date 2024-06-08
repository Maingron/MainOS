function initBottomInfo() {
	// create new element
	bottomInfoElement = document.createElement("div");
	bottomInfoElement.setAttribute("id", "bottom_info");
	bottomInfoElement.setAttribute("class", "bottom_info");
	bottomInfoElement.innerHTML = `
	<div>
	</div>
	`;
	document.body.appendChild(bottomInfoElement);

	attachedModules.push(updateBottomInfo);

	updateBottomInfo();

}

function updateBottomInfo() {
	let amountFiles = 0;
	let amountDirs = 0;

	for(let file of filesListed) {
		let thisType = iofs.getInfos(file).type;

		if(thisType == "dir") {
			amountDirs++;
		} else if(thisType == "file") {
			amountFiles++;
		}
	}

	if(currentPath == "/") {
		bottomInfoElement.innerHTML = `
		Space used:
		~ ${iofs.load("C:/.diskinfo/size_used.txt")} KB / ~ ${iofs.load("C:/.diskinfo/size.txt")} KB
		<br>
		<meter value='${iofs.load("C:/.diskinfo/size_used.txt")}' min='0' max='${iofs.load("C:/.diskinfo/size.txt")}'> </meter>
		`;
	} else {
		bottomInfoElement.innerHTML = `
		<div class="icon">
			<img src="${returnPathForFileIcon(currentPath)}" class="icon">
		</div>
		<path>${currentPath}</path>
		<br>
		<div title="Items">
			Folders: ${amountDirs}
			Files: ${amountFiles}
			<span>|</span>
			Total: ${filesListed.length}
		</div>
		`;
	}
}

document.addEventListener("DOMContentLoaded", function() {
	initBottomInfo();
});
