var settingtabs = document.getElementsByClassName("settingtab");
var objects = {};
var settingsChanged = [];
var systemCached;
var initialized = false;

var settings = [
	{category: "Customisation", id: "customisation", settings: [
		{category: "Appearance", settings: [
			{name: "Theme Color", type: "input>color", id: "system.user.settings.themecolor"},
			{name: "Accent Color", type: "input>color", id: "system.user.settings.themecolor2"},
			{name: "Background Image", type: "input>text", id: "system.user.settings.backgroundImage"},
			{name: "Dark Mode", type: "input>checkbox", id: "system.user.settings.prefersDarkMode"},
			{name: "Dark Mode (not THAT dark)", type: "input>checkbox", id: "system.user.settings.notsodarkmode"},
			{name: "Hover Color", type: "input>color", id: "system.user.settings.hovercolor"},
			{name: "Hover Opacity", type: "input>range", id: "system.user.settings.hoveropacity", min: "0", max: "1", step: "0.01"},
			{name: "Border Radius", type: "input>text", id: "system.user.settings.borderradius"},
			{name: "Fonts", type: "input>text", id: "system.user.settings.font.fonts"},
			{name: "Base Font Size", type: "input>text", id: "system.user.settings.font.baseSize"}
		]},
		{category: "Taskbar", settings: [
			{name: "Show Language", type: "input>checkbox", id: "system.user.settings.taskbar.showLang"},
			{name: "Show Clock", type: "input>checkbox", id: "system.user.settings.taskbar.showClock"},
			{name: "Show Seconds", type: "input>checkbox", id: "system.user.settings.taskbar.clockShowSeconds"},
			{name: "Show Show Desktop Button", type: "input>checkbox", id: "system.user.settings.taskbar.showShowDesktop"},
			{name: "Show Desktop Button Width in pixels", type: "input>number", id: "system.user.settings.taskbar.showShowDesktopWidth", min: "1", max: "100", step: "1"},
			{name: "Show Program Titles", type: "input>checkbox", id: "system.user.settings.taskbar.showProgramTitle"},
			{name: "Show Online Status", type: "input>checkbox", id: "system.user.settings.taskbar.showOnlineStatus"},
			{name: "Height in pixels", type: "input>number", id: "system.user.settings.taskbar.height", min: "10", max: "500", step: "1"}
		]}
	]},
	{category: "Language & Time", id: "language", settings: [
		{name: "Preferred Language", type: "select", id: "system.user.settings.language", options: [
			{name: "English", value: "en"},
			{name: "Deutsch", value: "de"},
			{name: "Français", value: "fr"},
			{name: "Español", value: "es"},
			{name: "Italiano", value: "it"},
			{name: "Nederlands", value: "nl"}
		]},
		{name: "Available Languages", type: "select>multiselect", size: 10, id: "system.user.settings.availableLanguages", options: [
			{name: "English", value: "en"},
			{name: "Deutsch", value: "de"},
			{name: "Français", value: "fr"},
			{name: "Español", value: "es"},
			{name: "Italiano", value: "it"},
			{name: "Nederlands", value: "nl"}
		]},
		{name: "Timezone", type: "select", id: "system.user.settings.timezone", options: [], disabled: true},
		{name: "Show time in 24h format", type: "input>checkbox", id: "system.user.settings.locale.time24h"},
		{name: "First day of the week", type: "select", id: "system.user.settings.locale.weekStart", options: [
			{name: "Monday", value: "monday"},
			{name: "Tuesday", value: "tuesday"},
			{name: "Wednesday", value: "wednesday"},
			{name: "Thursday", value: "thursday"},
			{name: "Friday", value: "friday"},
			{name: "Saturday", value: "saturday"},
			{name: "Sunday", value: "sunday"}
		]},
		{name: "Decimal Separator", type: "input>text", id: "system.user.settings.locale.decimalSeparator"},
		{name: "Thousand Separator", type: "input>text", id: "system.user.settings.locale.thousandSeparator"},
		{name: "Date Format", type: "input>text", id: "system.user.settings.locale.dateFormat"},
		{name: "Time Format", type: "input>text", id: "system.user.settings.locale.timeFormat"},
		{name: "Time & Date format combined", type: "input>text", id: "system.user.settings.locale.timeDateFormat"}
	]},
	{category: "Ease of access", id: "accessibility", settings: [
		{name: "Bigger Buttons", type: "input>checkbox", id: "system.user.settings.big_buttons"},
		{name: "Fullscreen by default", type: "input>checkbox", id: "system.user.settings.default_fullscreen"},
		{name: "Text to Speech optimized mode", type: "input>checkbox", id: "system.user.settings.accessibility.tts.enabled", disabled: true}
	]},
	{category: "Themes", id: "themes", disabled: true, settings: []},
	{category: "Advanced Settings", id: "advanced", settings: [
		{name: "Developer Mode", type: "input>checkbox", id: "system.user.settings.developer.enable"},
		{name: "Enable Online Repository", type: "input>checkbox", id: "system.user.settings.enableRepository"},
		{name: `Reset ${system.osDetails.name}`, type: "button", id: "dummy.resetos", onclick: "parent.localStorage.clear(); system.runtime.systemFunctions.reboot();"},
		// {name: "Update through Downgrade", type: "button", id: "dummy.updatethroughdowngrade", onclick: "", disabled: true}
	]},
	{category: "User settings", id: "user", settings: [
		{name: "Your Username", type: "input>text", id: "system.user.name", disabled: true},
		{name: "Your Password", type: "input>password", id: "dummy.system.user.password", disabled: true},
		{name: "User UID", type: "input>text", id: "system.user.uid", readonly: true},
		{name: "Autologin", type: "input>text", id: "system.autologin"}
	]},
	{category: "Developer Settings", id: "developer", scope: "developer", settings: [
		{name: "Enable All Settings", type: "input>checkbox", id: "system.user.settings.developer.enableAllSettings"},
		{name: `Brick System Variable`, type: "button", id: "dummy.bricksysvar", onclick: "savefile('C:/system/system_variable.txt', iofs.load('C:/system/system_variable.txt',false) + 'bricked', 1)"}
	]},
	{category: "Developer: Test", id: "developer-test", scope: "developer", settings: [
		{category: "Experimental Options", settings: [
			{name: "Test Setting", type: "input>text", id: "system.user.settings.developer.testsetting"},
				{category: "Sub", id: "subdeveloper", settings: [
					{name: "Test Setting", type: "input>text", id: "system.user.settings.developer.testsetting"}
				]},
				{category: "Sub", id: "subdeveloper", settings: [
					{name: "Test Setting", type: "input>text", id: "system.user.settings.developer.testsetting"},
					{category: "Sub", id: "subdeveloper", settings: [
						{name: "Test Setting", type: "input>text", id: "system.user.settings.developer.testsetting"}
					]}
				]}
		]}
	]}
]


function createCategories() {
	for (category of settings) {
		var categoryElement;
		var sidebarElement;

		if (document.querySelector(".category#" + category.id)) {
			categoryElement = document.querySelector(".category#" + category.id);
		} else {
			categoryElement = document.createElement("div");
			categoryElement.className = "category";
			categoryElement.id = category.id;
			categoryElement.innerHTML = `
				<header>
					<a class="category-go-back has_hover" icon="folder_up" href="#sidebar"></a>
					${category.category}
				</header>
				<div class="settings">
				</div>
			`;

			document.getElementById("categorycontainer").appendChild(categoryElement);
		}

		if (document.querySelector("#sidebar a[href='#" + category.id + "']")) {
			sidebarElement = document.querySelector("#sidebar a[href='#" + category.id + "']");
		} else {
			sidebarElement = document.createElement("a");
			sidebarElement.classList.add("has_hover");
			sidebarElement.href = `#${category.id}`;
			sidebarElement.innerText = category.category;
			sidebarElement.onclick = function() {
				document.querySelectorAll("#sidebar a.active").forEach((element) => {
					element.classList.remove("active");
				});
				this.classList.add("active");
			}

			document.getElementById("sidebar").appendChild(sidebarElement);
		}

		if (category.scope == "developer" && !system.user.settings.developer.enable) {
			category.disabled = true;
			// categoryElement.setAttribute("disabled", "disabled");
		}

		if (category.disabled && !system.user.settings?.developer?.enableAllSettings) {
			categoryElement.setAttribute("disabled", "disabled");
			sidebarElement.setAttribute("disabled", "disabled");
		}

		applySettingsToCategory(category.id);
	}
}

function buildSingleSetting(settingObj) {
	if(settingObj.category) {
		let subcategoryElement = document.createElement("details");
		subcategoryElement.className = "subcategory";
		if (subcategoryElement.id) {
			subcategoryElement.id = settingObj.id;
		}
		subcategoryElement.open = "open";
		subcategoryElement.innerHTML = `
			<summary inert>${settingObj.category}</summary>
		`;

		let subcategoryMain = document.createElement("div");
		for(setting of settingObj.settings) {
			subcategoryMain.appendChild(buildSingleSetting(setting));
		}

		subcategoryElement.appendChild(subcategoryMain);

		return subcategoryElement;
	} else {
		let settingElement = document.createElement("label");
		settingElement.className = "setting";
		settingElement.innerHTML = `
			<span class="settingname" inert>
				${setting.name}
			</span>
		`;

		if (setting.id) {
			settingElement.setAttribute("for", setting.id);
		}

		let settingElementInner = document.createElement("span");
		settingElementInner.className = "settinginput";

		settingElementInner.appendChild(buildSingleSettingInner(settingObj));

		settingElement.appendChild(settingElementInner);

		return settingElement;
	}


	function buildSingleSettingInner(setting) {
		let settingInput;
		if(setting.type?.split(">")[0] == "input"){
			settingInput = document.createElement("input");
			settingInput.type = setting.type.split(">")[1];

			if(setting.type.split(">")[1] == "checkbox") {
				if(parseSystemVariableSettingsPath(setting.id) == true) {
					settingInput.checked = "checked";
					settingInput.setAttribute("checked", "checked");
				}
			} else {
				settingInput.value = parseSystemVariableSettingsPath(setting.id);
				// settingInput.setAttribute("value", parseSystemVariableSettingsPath(setting.id));
			}
		} else if(setting.type == "select" || setting.type == "select>multiselect") {
			settingInput = document.createElement("select");
			for(option of setting.options) {
				var optionElement = document.createElement("option");
				optionElement.value = option.value;
				optionElement.innerHTML = option.name;
				if (parseSystemVariableSettingsPath(setting.id) == option.value) {
					optionElement.selected = "selected";
				}
				settingInput.appendChild(optionElement);
			}
			if(setting.type == "select>multiselect") {
				settingInput.setAttribute("multiple", "multiple");
				settingInput.removeAttribute("value");
				settingInput.value = "";
				let currentValues = parseSystemVariableSettingsPath(setting.id);
				for (optionElement of settingInput.options) {
					if(currentValues?.includes(optionElement.value)) {
						optionElement.setAttribute("selected", "selected");
					}
				}
			}
		} else if(setting.type == "button") {
			settingInput = document.createElement("button");
			settingInput.innerHTML = setting.name;
			settingInput.setAttribute("onclick", setting.onclick);
		} else if(setting.type?.split(">")[0] == "h") {
			switch (setting.type.split(">")[1]) {
				case("1"):
					settingInput = document.createElement("h1");
					break;
					case("2"):
					settingInput = document.createElement("h2");
					break;
				}
			settingInput.innerHTML = setting.name;
		}

		settingInput.className = "settinginput";
		settingInput.title = setting.id;
		settingInput.id = setting.id;
		settingInput.name = setting.id;

		for (const prop of ["min", "max", "step", "size"]) {
			if (setting[prop] !== undefined && setting[prop] !== null) {
				settingInput[prop] = setting[prop];
			}
		}


		if(setting.disabled && !system.user.settings.developer.enableAllSettings) {
			settingInput.setAttribute("disabled", "disabled");
		}

		if (setting.readonly && !system.user.settings.developer.enableAllSettings) {
			settingInput.setAttribute("readonly", "readonly");
		}

		switch (setting.type?.split(">")[1]) {
			case "checkbox":
				settingInput.setAttribute("onchange", "settingChanged(this, this.checked);");
				break;

			case "multiselect":
				settingInput.setAttribute("onchange", "settingChanged(this, this);");
				

			default:
				settingInput.setAttribute("onchange", "settingChanged(this, this.value);");
		}


		return settingInput;
	}
}

function applySettingsToCategory(categoryName) {
	var category = settings.find(category => category.id == categoryName);
	
	for (setting of category.settings) {
		let builtSetting = buildSingleSetting(setting);
		if (document.getElementById(builtSetting.getAttribute("for"))) {
			builtSetting.querySelectorAll("*").forEach((e) => {
				if (e.id == builtSetting.getAttribute("for")) {
					document.getElementById(builtSetting.getAttribute("for")).parentElement.replaceWith(e.parentElement);
				}
			});
		} else {
			if (builtSetting.classList.contains("subcategory") && initialized) {
				builtSetting.querySelectorAll("*:not(span)").forEach((e) => {
					if (e.classList.contains("settinginput")) {
						document.getElementById(e.id).parentElement.replaceWith(e.parentElement);
					}
				})
			} else {
				document.getElementById(category.id).getElementsByClassName("settings")[0].appendChild(builtSetting);
			}
		}
	}
}

function parseSystemVariableSettingsPath(path) {
	let splitPath = path.split(".");
	if(splitPath[0] == "dummy") {
		return "";
	}
	splitPath.shift();
	let sysvar = systemCached;
	
	for(let i = 0; i < splitPath.length; i++) {
		if(sysvar[splitPath[i]] === undefined) {
			return "";
		}
		sysvar = sysvar[splitPath[i]];
	}
	
	
	return sysvar;
}


function settingChanged(which, value) {
	let valueR;
	switch (which.tagName.toLowerCase()) {
		case "select":
			if (which.multiple) { // Multiselect
				valueR = Array.from(which.selectedOptions).map(({ value }) => value);
			}
	}
	if (!valueR) {
		valueR = value;
	}
	let whichWithoutPrefix = which.id.split("system.")[1];
	settingsChanged.push([whichWithoutPrefix, valueR]);

	which.setAttribute("modified", "modified");

	document.querySelectorAll("#button-save").forEach(button => {
		button.disabled = false;
	});
}

function saveChangedSettings() {
	fetchSystemSettings();
	settingsChanged.forEach((a, b) => {
		let resVar = system;
		const parts = a[0].split(".");

		parts.forEach((c, i) => {
			if (i === parts.length - 1) {
				resVar[c] = a[1];
			} else {
				resVar = resVar[c];
			}
		});
	});
	os.saveSystemVariable();
	os.refreshCSSVars();
	refreshCSSVars();
	os.loadsettings();
	document.querySelectorAll("#button-save").forEach(button => {
		button.setAttribute("disabled", "disabled");
	});

	settingsChanged = [];
}

function fetchSystemSettings() {
	systemCached = system;
}


function init() {
	os.refreshCSSVars();
	fetchSystemSettings();
	createCategories();
	initialized = true;
}

window.addEventListener('message', function (event) {
	if (event.data === 'pWindowReady') {
		if(!window.location.hash) {
			window.location.hash = "#sidebar";
		}

		init();

		pWindow.onBeforeUnrun = function() {
			if(!settingsChanged.length) {
				return;
			}

			pWindow.interactionLock = os.popupWindow.generatePopupWindow({
				"preset": "buttonAlert3",
				"title": "Apply Settings",
				"text": `
					You have unsaved changes. Do you want to apply the changes you made in the settings or discard them?
				`,
				"sender": this,
				"actionButtons": [
					{
						"label": "Save",
						"action": "saveAction",
						"closePopup": true,
						"icon": "save:mono"
					},
					{
						"label": "Discard",
						"action": "discardAction",
						"closePopup": true
					},
					{
						"label": "Cancel",
						"action": "cancelAction",
						"closePopup": true,
						"autofocus": true
					}
				],
				"actions": {
					"saveAction": function() {
						saveChangedSettings();
						pWindow.interactionLock = false;
						pWindow.close(true);
					},
					"discardAction": function() {
						pWindow.interactionLock = false;
						pWindow.close(true);
					},
					"cancelAction": function() {
						pWindow.interactionLock = false;
					}
				}
				});

			return false;
		}
	} else if (event.data === 'systemSettingsChanged') {
		fetchSystemSettings();
		createCategories();
	}
});
