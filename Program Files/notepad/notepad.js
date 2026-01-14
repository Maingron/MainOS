var path = window.parent.attr;
var fileIsReadonly = false;
var object = {}
object.savebutton = document.getElementById("savebutton");
object.filename1 = document.getElementById("filename1");
object.textcontent = document.getElementById("textcontent");
var objects = object;

if (path) {
	addEventListener("message", () => {
		if(event.data == "pWindowReady") {
			document.querySelector("#thediv").classList.add("loading");
			iofs.loadPromise(path, true).then((fileContent) => {
				object.textcontent.value = fileContent;
				document.querySelector("#thediv").classList.remove("loading");
			});

			if(iofs.getInfos(path).attributes["l$"]?.includes("1") || iofs.getInfos(path).attributes["l$"]?.includes("2")) {
				fileIsReadonly = true;
				document.body.classList.add("readonly_file");
				object.textcontent.setAttribute("readonly", "readonly");
				pWindow.title = iofs.getInfos(path).attributes["l"] + " (Read-only) - Notepad";

			} else {
				object.savebutton.innerHTML = "Save as " + path;
				object.filename1.style.display = "none";
				object.filename1.value = path;
				pWindow.title = path.split("/").pop() + " - Notepad";
			}
		}
	});

} else {
    object.filename1.style.display = "inline";
}

function savetextfile() {
	let saveSuccess = false;
	if (object.filename1.style.display == "none") {
		if(iofs.save(path, object.textcontent.value, "t=txt", 1)) {
			saveSuccess = true;
		}
	} else {
		if(iofs.save(filename1.value, object.textcontent.value, "t=txt", 1)) {
			saveSuccess = true;
		}
	}
	if(saveSuccess) {
		textcontent.removeAttribute("changed");
		if(fileIsReadonly) {
			os.run("notepad", filename1.value);
			pWindow.close();
		}
	} else {
		os.popupWindow.generatePopupWindow({
			"preset": "errorAlert",
			"title": "Error while saving file",
			"text": "An error occurred while saving the file. \nMaybe try a different filename or location."
		});
	}
}

setInterval(function () {
    if (objects.textcontent.value.includes("font=")) {
        objects.textcontent.style.fontFamily = objects.textcontent.value.split("font=")[1].split(";")[0];
    }
    if (objects.textcontent.value.includes("fontsize=")) {
        objects.textcontent.style.fontSize = objects.textcontent.value.split("fontsize=")[1].split(";")[0];
    }
}, 100);

if (objects.textcontent.value.includes("font=")) {
    objects.textcontent.style.fontFamily = objects.textcontent.value.split("font=")[1].split(";")[0];
}
if (objects.textcontent.value.includes("fontsize=")) {
    objects.textcontent.style.fontSize = objects.textcontent.value.split("fontsize=")[1].split(";")[0];
}

textcontent.addEventListener("change", () => {
	textcontent.setAttribute("changed", "changed");
});

addEventListener("message", () => {
	if(event.data == "pWindowReady") {
		pWindow.onBeforeUnrun = function() {
			if(!textcontent.getAttribute("changed") || fileIsReadonly) {
				return;
			}

			pWindow.interactionLock = os.popupWindow.generatePopupWindow({
				"preset": "buttonAlert3",
				"title": "Save?",
				"text": `
					Do you want to save changes to this document before closing?
				`,
				"sender": this,
				"actionButtons": [
					{
						"label": "Save",
						"action": "saveAction",
						"closePopup": true,
						"autofocus": true
					},
					{
						"label": "Don't Save",
						"action": "dontSaveAction",
						"closePopup": true
					},
					{
						"label": "Cancel",
						"action": "cancelAction",
						"closePopup": true
					}
				],
				"actions": {
					"saveAction": function() {
						if(!object.filename1.value || object.filename1.value.trim() == "") {
							os.popupWindow.generatePopupWindow({
								"preset": "buttonAlert3",
								"title": "Error",
								"text": "Please enter a valid filename first.",
								"type": "error",
								"actionButtons": [
									{
										"label": "OK",
										"action": "cancelAction",
										"closePopup": true,
										"autofocus": true
									}
								],
								"actions": {
									"cancelAction": function() {
										pWindow.interactionLock = false;
										object.filename1.focus();
									}
								},
							});
							return false;
						} else {
							pWindow.interactionLock = false;
							savetextfile();
							pWindow.close();
						}
					},
					"dontSaveAction": function() {
						pWindow.interactionLock = false;
						pWindow.close(true);
					},
					"cancelAction": function() {
						pWindow.interactionLock = false;
					}
				},
				"actionInputs": [
					{
						"type": "text",
						"id": "filenameinput",
						"placeholder": "Filename"
					}
				]
				});

			return false;
		}
	}
});
