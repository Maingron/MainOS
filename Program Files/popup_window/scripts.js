const popup_window_presets = {
	buttonAlert3: {
		"title": "Alert",
		"text": "This is an alert message.",
		"height": "250px",
		"width": "400px",
		"actionButtons": [
			{
				"label": "OK",
				"action": "ok",
				"closePopup": true,
				"autofocus": true
			},
			{
				"label": "Cancel",
				"action": "cancel",
				"closePopup": true
			},
			{
				"label": "More Info",
				"action": "moreInfo",
				"closePopup": false
			}
		],
		"actions": {
			"ok": function() {
				console.log("OK clicked");
			},
			"cancel": function() {
				console.log("Cancel clicked");
			},
			"moreInfo": function() {
				console.log("More Info clicked");
			}
		}
	}
}

let popup_window = {
	generatePopupWindow: function(content) {
		let popupWindowConf = {
			height: "400px",
			width: "300px",
			...content,
			caller: this
		}
		if(content.preset && popup_window_presets[content.preset]) {
			popupWindowConf = {
				...popupWindowConf,
				...popup_window_presets[content.preset],
				...content
			};
		}
		let popupWindow = os.run("popup_window", popupWindowConf, "windowed");

		return popupWindow;
	}
}

function createSystemHook() {
    os.popupWindow = popup_window;
}

if(window.parent.attr && window.parent.attr?.caller?.generatePopupWindow) {
	addEventListener("message", () => {
		if(event.data == "pWindowReady") {
			let attributes = pWindow.getAttributes();
			pWindow.setMinimized(false);
			pWindow.setMaximized(false);
			// pWindow.setAlwaysOnTop(true);

			if(attributes.height) {
				pWindow.setStyleProperty("height", attributes.height);
			}

			if(attributes.width) {
				pWindow.setStyleProperty("width", attributes.width);
			}

			if(attributes.top) {
				pWindow.setStyleProperty("top", attributes.top);
			}

			if(attributes.left) {
				pWindow.setStyleProperty("left", attributes.left);
			}

			pWindow.title = attributes.title || "Popup";
			pWindow.icon = attributes.icon || attributes?.sender?.icon || "#iofs:" + system.icons.transparent;

			if(attributes.html) {
				document.querySelector("main").innerHTML = attributes.html;
			} else if(attributes.text) {
				document.querySelector("main p").innerText = attributes.text;
			}

			if(attributes.actionButtons) {
				let actionButtonsContainer = document.createElement("div");
				actionButtonsContainer.classList.add("actionbuttons");

				for(let actionButton of attributes.actionButtons) {
					let buttonHTML = document.createElement("button");
					buttonHTML.type = "button";
					buttonHTML.id = actionButton.action;
					buttonHTML.innerText = actionButton.label;
					buttonHTML.onclick = function() {
						if(actionButton.closePopup) {

							window.setTimeout(() => {
								pWindow.close();
							}, 0);
						}

						(attributes.actions[actionButton.action]).call(this);
					};

					actionButtonsContainer.appendChild(buttonHTML);

					if(actionButton.autofocus) {
						buttonHTML.setAttribute("autofocus", "autofocus");
						buttonHTML.focus();
					}
				}

				document.querySelector("main").appendChild(actionButtonsContainer);
			}

			pWindow.focus();
		}
	});
}

addEventListener("message", () => {
	if(event.data == "pWindowReady") {
		if(!os.popupWindow) {
			createSystemHook();
		}
		document.querySelector("[autofocus]")?.focus();
	}
});
