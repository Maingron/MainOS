var settingtabs = document.getElementsByClassName("settingtab");
var objects = {};
var settingsChanged = [];

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
    for(category of settings) {
        var categoryElement = document.createElement("div");
        categoryElement.className = "category";
        categoryElement.id = category.id;
        categoryElement.innerHTML = `
            <header>
				<a class="category-go-back has_hover" icon="folder_up" href="#sidebar"></a>
				${category.category}</header>
            <div class="settings">
            </div>
        `;


        document.getElementById("categorycontainer").appendChild(categoryElement);

        var sidebarElement = document.createElement("a");
		sidebarElement.classList.add("has_hover");
		sidebarElement.href = `#${category.id}`;
		sidebarElement.innerText = category.category;
		sidebarElement.onclick = function() {
			document.querySelectorAll("#sidebar a.active").forEach((element) => {
				element.classList.remove("active");
			});
			this.classList.add("active");
		}

        if(category.scope == "developer" && !system.user.settings.developer.enable) {
            category.setAttribute("disabled", "disabled");
        }


        document.getElementById("sidebar").appendChild(sidebarElement);

        if(category.disabled && !system.user.settings?.developer?.enableAllSettings) {
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
		subcategoryElement.id = settingObj.id;
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
				}
			} else {
				settingInput.value = parseSystemVariableSettingsPath(setting.id);
			}
		} else if(setting.type == "select" || setting.type == "select>multiselect") {
			settingInput = document.createElement("select");
			for(option of setting.options) {
				var optionElement = document.createElement("option");
				optionElement.value = option.value;
				optionElement.innerHTML = option.name;
				settingInput.appendChild(optionElement);
			}
			if(setting.type == "select>multiselect") {
				settingInput.setAttribute("multiple", "multiple");
				let currentValues = parseSystemVariableSettingsPath(setting.id);
				for(optionElement of settingInput.options) {
					if(currentValues?.includes(optionElement.value)) {
						optionElement.selected = "selected";
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
		
		if(setting.min) {
			settingInput.min = setting.min;
		}

		if(setting.max) {
			settingInput.max = setting.max;
		}

		if(setting.step) {
			settingInput.step = setting.step;
		}

		if(setting.size) {
			settingInput.size = setting.size;
		}


		if(setting.disabled && !system.user.settings.developer.enableAllSettings) {
			settingInput.setAttribute("disabled", "disabled");
		}

		settingInput.setAttribute("onchange", setting.id + " = this.value; settingChanged(this);");

		if(setting.type?.split(">")[1] == "checkbox") {
			settingInput.setAttribute("onchange", setting.id + " = this.checked; settingChanged(this);");
		}

		return settingInput;
	}
}

function applySettingsToCategory(categoryName) {
	var category = settings.find(category => category.id == categoryName);
	for(setting of category.settings) {
		document.getElementById(category.id).getElementsByClassName("settings")[0].appendChild(buildSingleSetting(setting));
    }
}

function parseSystemVariableSettingsPath(path) {
    var splitPath = path.split(".");
    if(splitPath[0] == "dummy") {
        return "";
    }
    splitPath.shift();
    let sysvar = system;

    for(let i = 0; i < splitPath.length; i++) {
		if(sysvar[splitPath[i]] === undefined) {
			return "";
		}
        sysvar = sysvar[splitPath[i]];
    }

    
    return sysvar;
}


function settingChanged(which) {
	settingsChanged.push(which.id);

	document.querySelectorAll("#button-save").forEach(button => {
		button.disabled = false;
	});
}

function saveChangedSettings() {
	os.saveSystemVariable();
	os.refreshCSSVars();
	refreshCSSVars();
	os.loadsettings();
	document.querySelectorAll("#button-save").forEach(button => {
		button.setAttribute("disabled", "disabled");
	});

	settingsChanged = [];
}

window.addEventListener('message', function (event) {
	if (event.data === 'pWindowReady') {
		if(!window.location.hash) {
			window.location.hash = "#sidebar";
		}
		os.loadsettings();
		os.refreshCSSVars();
		createCategories();

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
	}
});
