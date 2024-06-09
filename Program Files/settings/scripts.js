var settingtabs = document.getElementsByClassName("settingtab");
var objects = {};
objects.bool_range = document.getElementsByClassName("bool_range");

var settings = [
    {category: "Customisation", id: "customisation", settings: [
        {name: "Theme Color", type: "input>color", id: "system.user.settings.themecolor"},
        {name: "Accent Color", type: "input>color", id: "system.user.settings.themecolor2"},
        {name: "Background Image", type: "input>text", id: "system.user.settings.backgroundImage"},
        {name: "Dark Mode", type: "input>checkbox", id: "system.user.settings.prefersDarkMode"},
        {name: "Dark Mode (not THAT dark)", type: "input>checkbox", id: "system.user.settings.notsodarkmode"},
        {name: "Hover Color", type: "input>color", id: "system.user.settings.hovercolor"},
        {name: "Hover Opacity", type: "input>range", id: "system.user.settings.hoveropacity", min: "0", max: "1", step: "0.01"},
        {name: "Border Radius", type: "input>text", id: "system.user.settings.borderradius"},
        {name: "Fonts", type: "input>text", id: "system.user.settings.font.fonts"},
        {name: "Base Font Size", type: "input>text", id: "system.user.settings.font.baseSize"},
        {name: "Preffered Language", type: "select", id: "system.user.settings.language", options: [
            {name: "English", value: "en"},
            {name: "Deutsch", value: "de"},
            {name: "Français", value: "fr"},
            {name: "Español", value: "es"},
            {name: "Italiano", value: "it"},
            {name: "Nederlands", value: "nl"}
        ], disabled: true},
        {name: "Taskbar settings:", type: "h>2"},
        {name: "Show Language", type: "input>checkbox", id: "system.user.settings.taskbar.showLang"},
        {name: "Show Clock", type: "input>checkbox", id: "system.user.settings.taskbar.showClock"},
        {name: "Show Show Desktop Button", type: "input>checkbox", id: "system.user.settings.taskbar.showShowDesktop"},
        {name: "Show Program Titles", type: "input>checkbox", id: "system.user.settings.taskbar.showProgramTitle"},
        {name: "Height in pixels", type: "input>number", id: "system.user.settings.taskbar.height", min: "0", max: "500", step: "1"},
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
        {name: `Reset ${system.osDetails.name}`, type: "button", id: "dummy.resetos", onclick: "parent.localStorage.clear(); top.window.location.reload();"},
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

    ]}
]


function createCategories() {
    for(category of settings) {
        var categoryElement = document.createElement("div");
        categoryElement.className = "category";
        categoryElement.id = category.id;
        categoryElement.innerHTML = `
            <h2>${category.category}</h2>
            <div class="settings">
            </div>
        `;


        document.getElementById("categorycontainer").appendChild(categoryElement);

        var sidebarElement = document.createElement("button");
        sidebarElement.className = "sidebaritem";
        sidebarElement.innerHTML = `
            <a href="#${category.id}">${category.category}</a>
        `;

        if(category.scope == "developer" && !system.user.settings.developer.enable) {
            category.disabled = true;
        }


        document.getElementById("sidebar").appendChild(sidebarElement);

        if(category.disabled && system.user.settings.developer.enableAllSettings != true) {
            categoryElement.disabled = "disabled";
            sidebarElement.disabled = "disabled";
        }


        applySettingsToCategory(category.id);
    }
}

function applySettingsToCategory(categoryName) {
    var category = settings.find(category => category.id == categoryName);
    for(setting of category.settings) {
        var settingElement = document.createElement("div");
        settingElement.className = "setting";
        settingElement.innerHTML = `
            <div class="settingname">${setting.name}</div>
            <div class="settinginput">
            </div>
        `;
        document.getElementById(category.id).getElementsByClassName("settings")[0].appendChild(settingElement);

        if(setting.type?.split(">")[0] == "input"){
            var settingInput = document.createElement("input");
            settingInput.type = setting.type.split(">")[1];

            if(setting.type.split(">")[1] == "checkbox") {
                if(parseSystemVariableSettingsPath(setting.id) == true) {
                    settingInput.checked = "checked";
                }
            } else {
                settingInput.value = parseSystemVariableSettingsPath(setting.id);
            }
        } else if(setting.type == "select") {
            var settingInput = document.createElement("select");
            for(option of setting.options) {
                var optionElement = document.createElement("option");
                optionElement.value = option.value;
                optionElement.innerHTML = option.name;
                settingInput.appendChild(optionElement);
            }
        } else if(setting.type == "button") {
            var settingInput = document.createElement("button");
            settingInput.innerHTML = setting.name;
            settingInput.setAttribute("onclick", setting.onclick);
        } else if(setting.type?.split(">")[0] == "h") {
            var settingInput;
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

        if(setting.disabled && system.user.settings.developer.enableAllSettings != true) {
            settingInput.disabled = "disabled";
        }

        settingInput.setAttribute("onchange", setting.id + " = this.value; settingChanged();");

        if(setting.type?.split(">")[1] == "checkbox") {
            settingInput.setAttribute("onchange", setting.id + " = this.checked; settingChanged();");
        }

        settingElement.getElementsByClassName("settinginput")[0].appendChild(settingInput);
    }
}

function parseSystemVariableSettingsPath(path) {
    var splitPath = path.split(".");
    if(splitPath[0] == "dummy") {
        return "";
    }
    splitPath.shift();
    var sysvar = system;

    for(var i = 0; i < splitPath.length; i++) {
        sysvar = sysvar[splitPath[i]];
    }

    
    return sysvar;
}

function settingChanged() {
    os.saveSystemVariable();
    os.refreshCSSVars();
    refreshCSSVars();
    os.loadsettings();
}



createCategories();
