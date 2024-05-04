function initFileAttributes() {
	attachedModules.push(applyFileAttributesToAll);
}

function applyFileAttributesToAll() {
	for(fileElement of document.getElementById("content_files").children) {
		// if file name starts with ., add class hidden
		if(fileElement.innerText.startsWith(".")) {
			fileElement.classList.add("fattr-hidden");
		}
		var fileAttributes = getAttributes(fileElement.getAttribute("path"));
		// find entry starting with A=
		for(attribute of fileAttributes) {
			if(attribute.startsWith("A=")) {
				attribute = attribute.split("A=")[1];
				attribute = attribute.split("");
				
				var newColorDotDiv = document.createElement("div");
				newColorDotDiv.classList.add("color_dot_div");
				fileElement.appendChild(newColorDotDiv);

				for(a_attribute of attribute) {
					if(["A", "B", "C", "D", "E", "F", "0"].includes(a_attribute)) {
						addColorDot(newColorDotDiv, a_attribute);

						if(a_attribute == "0") {
							fileElement.classList.add("system_file");
						}
					} else if(["a"].includes(a_attribute)) {
						fileElement.classList.add("fattr-hidden");
					} else if(["!"].includes(a_attribute)) {
						fileElement.classList.add("fattr-system_file");
						fileElement.classList.add("fattr-outdated_file");
						addColorDot(newColorDotDiv, "outdated");
					}
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
