var path = window.parent.attr;
var object = {}
object.savebutton = document.getElementById("savebutton");
object.filename1 = document.getElementById("filename1");
object.textcontent = document.getElementById("textcontent");
var objects = object;

if (path) {
    object.textcontent.value = iofs.load(path);
    object.savebutton.innerHTML = "Save as " + path;
    object.filename1.style.display = "none";
	object.filename1.value = path;

	addEventListener("message", () => {
		if(event.data == "pWindowReady") {
			pWindow.title = path.split("/").pop() + " - Notepad";
		}
	});

} else {
    object.filename1.style.display = "inline";
}

function savetextfile() {
    if (object.filename1.style.display == "none") {
        iofs.save(path, object.textcontent.value, "t=txt", 1);
    } else {
        iofs.save(filename1.value, object.textcontent.value, "t=txt", 1);
    }
	textcontent.removeAttribute("changed");
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
			if(!textcontent.getAttribute("changed")) {
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
