explorer.modules.settingsStuff = {
	altbar: {
		initialized: false,
		init: function() {
			explorer.modules.settingsStuff.altbar.initialized = true;
			explorer.modules.settingsStuff.altbar.updateSettings();

		},
		updateSettings: function(event) {
			pWindow.pullSettings();

			for(let checkboxItem of document.querySelectorAll(".altbar input[type='checkbox']")) {
				let mySettingAttr = checkboxItem.getAttribute("value-key");
				let mySetting = mySettingAttr.split(".").reduce((o,i)=>o[i], window);
				checkboxItem.checked = mySetting;
			}
		},

		handleSettingChange: function(event) {
			let targetElement = event.target;
			let mySettingAttr = targetElement.getAttribute("value-key");
			let mySettingValue = targetElement.checked;
			
			let settingParts = mySettingAttr.split(".");
			let settingObj = window;
			for(let i = 0; i < settingParts.length - 1; i++) {
				settingObj = settingObj[settingParts[i]];
			}
			settingObj[settingParts[settingParts.length - 1]] = mySettingValue;

			pWindow.pushSettings();

			// Update settings in the altbar
			explorer.modules.settingsStuff.altbar.updateSettings();
			explorerrefresh();
		}
	},

	init: function() {
		explorer.modules.settingsStuff.altbar.init();
		attachedModules.push(explorer.modules.settingsStuff.handler);
	},

	handler: function(event, handleCall = false) {
		if(handleCall) {
			window.setTimeout(function() { // Timeout necessary since we need a delay when changing a setting - else this would override the new setting immediately
				explorer.modules.settingsStuff.altbar.updateSettings(event);
			}, 0);
		}
	}
}

addEventListener("message", (event) => {
	if(event.data == "pWindowReady") {
		explorer.modules.settingsStuff.init();
	}
});
