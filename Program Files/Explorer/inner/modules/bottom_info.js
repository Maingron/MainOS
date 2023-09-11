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
	if(currentPath == "/") {
		bottomInfoElement.innerHTML = `
		Space used:
		~ ${loadfile("C:/.diskinfo/size_used.txt")} KB / ~ ${loadfile("C:/.diskinfo/size.txt")} KB
		<br>
		<meter value='${loadfile("C:/.diskinfo/size_used.txt")}' min='0' max='${loadfile("C:/.diskinfo/size.txt")}'> </meter>
		`;
	} else {
		bottomInfoElement.innerHTML = `
		<div class="icon">
			<img src="${returnPathForFileIcon(currentPath)}" class="icon">
		</div>
		<path>${currentPath}</path>
		<br>
		<div title="Items">
			Folders: ${filesListed.filter(isfolder).length}
			Files: ${filesListed.length - filesListed.filter(isfolder).length}
			<span>|</span>
			Total: ${filesListed.length}
		</div>
		`;
	}
}

document.addEventListener("DOMContentLoaded", function() {
	initBottomInfo();
});