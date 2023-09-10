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
		bottomInfoElement.style.display = "block";
	} else {
		bottomInfoElement.style.display = "none";
		return;
	}
	bottomInfoElement.innerHTML = `
	Space used:
	~ ${loadfile("C:/.diskinfo/size_used.txt")} KB / ~ ${loadfile("C:/.diskinfo/size.txt")} KB
	<br>
	<meter value='${loadfile("C:/.diskinfo/size_used.txt")}' min='0' max='${loadfile("C:/.diskinfo/size.txt")}'> </meter>
	`;
}

document.addEventListener("DOMContentLoaded", function() {
	initBottomInfo();
});