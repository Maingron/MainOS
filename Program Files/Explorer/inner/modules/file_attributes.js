function initFileAttributes() {
	attachedModules.push(applyFileAttributesToAll);
}

function applyFileAttributesToAll() {
	for(fileElement of document.getElementById("content_files").children) {
		// if file name starts with ., add class hidden
		if(fileElement.innerText.startsWith(".")) {
			fileElement.classList.add("fattr-hidden");
			if(!pWindow?.settings?.showHiddenFiles) {
				fileElement.setAttribute("hidden", "hidden");
			}
		}
		var fileAttributes = iofs.getInfos(fileElement.getAttribute("path")).attributes;

		if(fileAttributes["l"]) {
			fileElement.classList.add("fattr-link_file");
			fileElement.setAttribute("linkedFile", fileAttributes["l"]);
		}

		if(fileAttributes["A"]) {
			let attribute = fileAttributes["A"].split("");
			let newColorDotDiv = document.createElement("div");
			newColorDotDiv.classList.add("color_dot_div");
			fileElement.appendChild(newColorDotDiv);

			for(let a_attribute of attribute) {
				if(["A", "B", "C", "D", "E", "F", "f", "0"].includes(a_attribute)) {
					addColorDot(newColorDotDiv, a_attribute);
					if(a_attribute == "0") {
						fileElement.classList.add("system_file");
						if(!pWindow?.settings?.showSystemFiles) {
							fileElement.setAttribute("hidden", "hidden");
						}
					}
					if(a_attribute == "f") {
						fileElement.classList.add("fattr-favorite_file");
						fileElement.style.order -=50;
					}
				} else if(["a"].includes(a_attribute)) {
					fileElement.classList.add("fattr-hidden");
					if(!pWindow?.settings?.showHiddenFiles) {
						fileElement.setAttribute("hidden", "hidden");
					}

				} else if(["!"].includes(a_attribute)) {
					fileElement.classList.add("fattr-system_file");
					fileElement.classList.add("fattr-outdated_file");
					addColorDot(newColorDotDiv, "outdated");
				}
			}
		}
	}
}

initFileAttributes();


function addColorDot(colorDotDiv, color) {
	var newColorDot = document.createElement("div");
	newColorDot.classList.add("color_dot");
	newColorDot.classList.add("color_dot_" + color);
	colorDotDiv.appendChild(newColorDot);
}
