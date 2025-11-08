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
		const diskUsed = parseFloat(iofs.load("C:/.diskinfo/size_used.txt")) || 0;
		const diskSize = parseFloat(iofs.load("C:/.diskinfo/size.txt")) || 5000;
		bottomInfoElement.innerHTML = `
		Space used:
		~ ${diskUsed.toFixed(2)} KB / ~ ${diskSize.toFixed(2)} KB
		<br>
		<meter value='${diskUsed}' min='0' max='${diskSize}'> </meter>
		`;
	} else {
		bottomInfoElement.innerHTML = `
		<div class="icon">
			<img src="${returnPathForFileIcon(currentPath, false)}" class="icon">
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
