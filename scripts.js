"use strict";

loadsettings();

objects.content = document.getElementsByClassName("content")[0];
objects.progicons = document.querySelectorAll(".desktop__icons")[0];
objects.programs = document.getElementsByClassName("programs")[0];


function setDocumentMeta() { // Overrides some things in the document head
    document.head.getElementsByTagName("meta").namedItem("theme-color").content = system.user.settings.themecolor;
    document.head.getElementsByTagName("meta").namedItem("msapplication-TileColor").content = system.user.settings.themecolor;
}

function loadsettings() {
    // setting.username = loadfile("C:/mainos/system32/settings/username.txt");
    // setting.userpath = "C:/users/" + setting.username + "/";
    // setting.userdata = setting.userpath + "Program Data/";
    // setting.settingpath = "C:/users/" + setting.username + "/settings/";
    setting.time = new Date();

    // setting.backgroundimage = loadsetting("backgroundimage");
    setting.temp = {}; 

    // document.documentElement.style.setProperty("--themecolor", setting.themecolor);
    // document.documentElement.style.setProperty("--themecolor2", setting.themecolor2);
    // document.documentElement.style.setProperty("--font", setting.font);

    // document.documentElement.style.setProperty("--hovercolor",setting.hovercolor);
    // document.documentElement.style.setProperty("--hovercolornontransparent",setting.hovercolornontransparent);

	if(taskbar) {
		taskbar.updateSettings(taskbar);
	}

	document.documentElement.style.setProperty("--taskbarheight", system.user.settings.taskbar.height + "px");


	setDocumentMeta();

	for(let i = 0; i < system?.runtime?.pid?.length; i++) {
		getWindowByPid(i)?.frame?.contentWindow?.postMessage("systemSettingsChanged");
	}

}


program = system.user.programs;

if (iofs.exists("C:/mainos/customprograms.txt")) {
    try {
        program = Object.assign(program, ifjsonparse(iofs.load("C:/mainos/customprograms.txt")));
    } catch (e) {
        objs = [program, ifjsonparse(iofs.load("C:/mainos/customprograms.txt"))];
        result = objs.reduce(function(r, o) {
            Object.keys(o).forEach(function(k) {
                r[k] = o[k];
            });
            program = r;
        }, {});
    }
}


if (system.user.settings.enableRepository) { // Load programs from repository if repository is enabled
	for(let repoFile of iofs.listdir("C:/system/repositories/")) {
		if(!repoFile.endsWith(".json")) {
			continue;
		}
		let repoFileData = iofs.load(repoFile, true);
		try {
			const repoFileJson = JSON.parse(repoFileData);

			for(let entry of Object.keys(repoFileJson)) {
				if(repoFileJson[entry].disabled) {
					repoFileJson[entry] = [];
					repoFileJson[entry].maxopen = "0";
					repoFileJson[entry].disabled = true;
					repoFileJson[entry].spawnicon = false;
					repoFileJson[entry].src = "about:blank";
					continue;
				}
				system.user.programs[entry] = repoFileJson[entry];
				
			}

		} catch(e) {}
	}
}


// Add / handle programs
// TODO: Finish this function and this stuff
function loadInstalledPrograms() {
    let allProgramJson = iofs.load("C:/system/installed_programs.json");
    try {
        allProgramJson = JSON.parse(allProgramJson);
    } catch(e) {
        throw new Error("Installed programs JSON is invalid. Abourting.");
    }

    for (let myProgram of Object.keys(allProgramJson)) {
        myProgram = allProgramJson[myProgram];
        if (myProgram.disabled) {
            continue;
        }
        system.user.programs[myProgram.id] = myProgram;
    }
}

loadInstalledPrograms();

for(var i = 0; i < Object.keys(system.user.programs).length; i++) {
    var myProgram = system.user.programs[Object.keys(system.user.programs).sort()[i]];
    if(myProgram.disabled) {
        continue;
    }
    loadProgramMetadata(myProgram);
}


function loadProgramMetadata(which) { // Load program metadata from program file and handle some other stuff
    if(typeof(which) == "string") {
        which = system.user.programs[which];
    }

    if(which.src && which.src.includes("//")) { // Don't request metadata from external programs. This would result in access denied.
        addDesktopIcon(which);
        addProgramIconToFolder(which);
        
        which.metaloaded = true;
        return;
    }
    if(which.metaloaded) {
        return; // Don't load metadata twice
    }



    let xhr = new XMLHttpRequest();
    xhr.open("GET", which.src, true);
    xhr.onload = function() {
        let rawMetaString = xhr.responseText.substring(0, 1200); // Get first 1200 characters of program - Everything relevant must be within this range
        if(rawMetaString.includes("<head") && rawMetaString.includes("</head>")) { // Only continue if <head> and </head> are present in range
            let metaString = rawMetaString.replaceAll(/\<\!\-\-([\s\S]*?)\-\-\>/g, ""); // Remove comments
            metaString = metaString.split("</head>")[0] // Extract everything before </head>
            metaString = metaString.replace(/\n|\r|\t/g, ''); // Remove empty lines and tabs
            metaString = metaString.replaceAll(/\<\/(.*?)\>/g, ""); // Remove all </...> tags
            metaString = metaString.split("\<");
            metaString.shift(); // Remove first element (everything before first <)

            const skipThose = [ // Skip these tags // TODO: Add possibility to filter after space (e.g. <meta name="author" content="..."> -> author)
                "script", "!DOCTYPE", "!doctype", "noscript", "style"
            ];
            for(let i = 0; i < metaString.length; i++) {
                if(skipThose.includes(metaString[i].split(" ")[0])) {
                    metaString.splice(i, 1);
                }
            }

            for(let myMeta of metaString) {
                if(myMeta.includes("title>")) {
                    // Title
                    which.title = myMeta.split("title>")[1];
                }
                if(myMeta.includes("shortcut icon")) {
                    // Icon
                    which.icon = myMeta.split("href=\"")[1].split("\"")[0];
                }
            }
            which.metaloaded = true;
        } else {
            which.hasErrors = true;
        }

        addDesktopIcon(which);
        addProgramIconToFolder(which);

        if(which.autostart) { // TODO: Make it work for external programs
            // Autostart
            if(!system.user.autorun) {
                system.user.autorun = [];
            }
            system.user.autorun.push([which.id,[],which.autostart]);
        }

    }
    xhr.send();
}

function addDesktopIcon(which) {
    if(which.devonly && !system.user.settings.developer.enable) {
        return;
    }

    if(which.spawnicon != 0) {
		let newProgIcon = document.createElement("a");
		newProgIcon.className = "programicon has_hover";
		newProgIcon.id = which.id;
		newProgIcon.title = which.title;
		newProgIcon.href = "#";

		newProgIcon.addEventListener("click", function() {
			(async() => {
				run(this.id);
			})();
		});

		iofs.loadPromise(which.icon, false).then((resultImage) => {
			newProgIcon.innerHTML = `
				<img src="${resultImage}" loading="lazy" alt="">
				<span>${which.title}</span>
			`;


			objects.progicons.appendChild(newProgIcon);
		}).catch((e) => {
			newProgIcon.innerHTML = `
				<img src="${which.icon}" loading="lazy" alt="">
				<span>${which.title}</span>
			`;
			objects.progicons.appendChild(newProgIcon);
		});
	}
}

function addProgramIconToFolder(which) {
    setTimeout(() => {
        iofs.save(system.user.paths.programShortcuts + which.title.trim() + ".run", JSON.stringify(which), "run", 1);
    }, 0);
}

/**
 * @deprecated
 */

function ifjsonparse(which) { // Parse JSON but only if valid // deprecated
    try {
        JSON.parse(which);
    } catch (e) {
        return {};
    }
    return JSON.parse(which);
}


window.addEventListener("mousemove", function(e) {
    systemRuntime.pos.mouseX = e.clientX;
    systemRuntime.pos.mouseY = e.clientY;
});

window.addEventListener("touchmove", function(e) {
    systemRuntime.pos.mouseX = e.targetTouches[0].pageX;
    systemRuntime.pos.mouseY = e.targetTouches[0].pageY;
});

window.addEventListener("touchstart", function(e) {
    systemRuntime.pos.mouseX = e.targetTouches[0].pageX;
    systemRuntime.pos.mouseY = e.targetTouches[0].pageY;
});

window.addEventListener("mouseup", function() {
    systemRuntime.clicking = 0;
});

window.addEventListener("touchend", function() {
    systemRuntime.clicking = 0;
});






window.setInterval(function() {
    setting.time = new Date();
    setting.time = {
        hour: setting.time.getHours(),
        minute: setting.time.getMinutes(),

        year: setting.time.getFullYear(),
        month: setting.time.getMonth() + 1,
        day: setting.time.getDate()
    };

    if (setting.time.hour < 10) {
        setting.time.hour = "0" + setting.time.hour;
    }
    if (setting.time.minute < 10) {
        setting.time.minute = "0" + setting.time.minute;
    }

    if (setting.time.month < 10) {
        setting.time.month = "0" + setting.time.month;
    }

    if (setting.time.day < 10) {
        setting.time.day = "0" + setting.time.day;
    }


    setting.time.date = setting.time.year + "-" + setting.time.month + "-" + setting.time.day;
    setting.time.time = setting.time.hour + ":" + setting.time.minute;
    setting.time.full = setting.time.date + " " + setting.time.time;
    /* Automatically update these time displays: */
}, 250);


/**
 * Fullscreen system or element
 * @param {HTMLElement} element
 * @param {boolean} state
 */

function enterFullscreen(element = document.body, state = !document.fullscreenElement) {
    window.setTimeout(function() {
        if(document.fullscreenElement == null || document.fullscreenElement == undefined || state == true) {
            if (element.requestFullscreen) { element.requestFullscreen(); }
            else if (element.mozRequestFullScreen) { element.mozRequestFullScreen(); }
            else if (element.msRequestFullscreen) { element.msRequestFullscreen(); }
            else if (element.webkitRequestFullscreen) { element.webkitRequestFullscreen(); }
            else if (element.requestFullscreen) { element.requestFullscreen(); }
        } else {
            if (document.exitFullscreen) { document.exitFullscreen(); }
            else if (document.msExitFullscreen) { document.msExitFullscreen(); }
            else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
            else if (document.exitFullscreen) { document.exitFullscreen(); }
        }
    }, 0);
}



if (system.user.settings.default_fullscreen == 1) { // Enter fullscreen on start if requested by setting
    document.body.getElementsByClassName("content")[0].addEventListener("click", function() {
        enterFullscreen();
    }, {"once": true});
}


document.getElementById("username").innerText = system.user.name; // Display username on desktop

// Check space on disk
iofs.save("C:/.diskinfo/size_used.txt", String(JSON.stringify(localStorage).length / 1000), "t=txt", true);
iofs.save("C:/.diskinfo/size_remaining.txt", String(parseFloat(iofs.load("C:/.diskinfo/size.txt")) - parseFloat(iofs.load("C:/.diskinfo/size_used.txt"))), "t=txt", true);

// Re-Create program shortcuts; Delete them beforehand
iofs.listdir(system.user.paths.programShortcuts).forEach((item) => {
    iofs.delete(item, 1);
});

window.setTimeout(() => {
	iofs.loadPromise(system.user.settings.backgroundImage, false).then((resultImage) => {
		document.querySelector(".desktop .desktop__background").style.backgroundImage = "url(" + resultImage + ")"; // Load Desktop Background
	});
	if(_paq) {
        _paq.push(['setUserId', system.osDetails.uid ?? 0]);
        _paq.push(['setCustomVariable', 1, 'version', system.osDetails.version, 'visit']);
        _paq.push(["setDocumentTitle", document.title]);
        _paq.push(['trackPageView']);
        _paq.push(['trackEvent', "System State", "Boot successful"]);
    // _paq.push(['enableHeartBeatTimer']);
    }
    window.addEventListener("beforeunload", function (e) {
        if(_paq) {
            _paq.push(['trackEvent', "System State", "Shutdown", "beforeunload"]);
        }
    });
}, 0);
