var objects = {};
var register = [];
var program = {};
var processList = pid = [];

var systemRuntime = {
    "pidmax": 0,
    "zindex": 10,
    "pos": {
        "mouseX": 0,
        "mouseY": 0
    },
    "clicking": 0,
    "clicked": 0,
    "timeOfBoot": new Date().getTime(), // Log time of boot
    "processList": pid,
    "pid": pid,
    "documentRoot": location.pathname
};

loadsettings();

var path = {
    "system": "C:/mainos/",
    "sysicons": "C:/mainos/system32/icons/",
    "user": "C:/users/User/",
    "programFiles": "C:/Program Files/",
    "appdata": "C:/users/"+setting.username+"/appdata/"
}
var appdata = path.appdata; // deprecated


var objs, result, iattr, attr;


if(!mainos) {
    var mainos = {};
}

mainos.timeOfBoot = new Date().getTime(); // Log time of boot

objects.content = document.getElementsByClassName("content")[0];
objects.progicons = document.getElementsByClassName("icons")[0];
objects.programs = document.getElementsByClassName("programs")[0];
objects.taskbarlanguage = document.getElementsByClassName("taskbarlanguage")[0];


function jsoncombine(which1, which2) {
    try {
        which1 = Object.assign(which1, which2);
    } catch (e) {
        objs = [which1, which2];
        result = objs.reduce(function(r, o) {
            Object.keys(o).forEach(function(k) {
                r[k] = o[k];
            });
            which1 = r;
        }, {});
    }
    return which1;
}


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


    setDocumentMeta();
}


objects.taskbarlanguage.innerHTML = system.user.settings.language; // Show language in taskbar

// program = JSON.parse(loadfile("C:/mainos/programs.dat"));
program = system.user.programs;

if (isfile("C:/mainos/customprograms.txt")) {
    try {
        program = Object.assign(program, ifjsonparse(loadfile("C:/mainos/customprograms.txt")));
    } catch (e) {
        objs = [program, ifjsonparse(loadfile("C:/mainos/customprograms.txt"))];
        result = objs.reduce(function(r, o) {
            Object.keys(o).forEach(function(k) {
                r[k] = o[k];
            });
            program = r;
        }, {});
    }
}


if (system.user.settings.enableRepository) { // Load programs from repository if repository is enabled
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", system.osDetails.serverrepository, true); // TODO: Make async
        xhr.onload = function() {
            // program = Object.assign(program, ifjsonparse((xhr.responseText)));
            const repoList = ifjsonparse(xhr.responseText);
            setTimeout(function() {
                for (let i in repoList) {
                    system.user.programs[i] = repoList[i];
                    loadProgramMetadata(repoList[i]);
                }
            }, 100)

        }
        xhr.send();

    } catch (e) {}

}


// Add / handle programs
for(var i = 0; i < Object.keys(system.user.programs).length; i++) {
    var myProgram = system.user.programs[Object.keys(system.user.programs).sort()[i]];
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
            let metaString = rawMetaString.replaceAll(/\<\!\-\-(.*?)\-\-\>/g, ""); // Remove comments
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

            for(myMeta of metaString) {
                if(myMeta.includes("title>")) {
                    // Title
                    which.title = myMeta.split("title>")[1];
                }
                if(myMeta.includes("shortcut icon")) {
                    // Icon
                    which.icon = myMeta.split("href=\"")[1].split("\"")[0];
                }
                if(myMeta.includes("version=")) {
                    // Version
                    which.version = myMeta.split("version=\"")[1].split("\"")[0];
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
            (async() => {
                run(which.id,[],which.autostart);
            })();
        }

    }
    xhr.send();
}

function addDesktopIcon(which) {
    if(which.devonly && !system.user.settings.developer.enable) {
        return;
    }
    if(which.germantv && system.user.settings.german_tv != 1) {
        return;
    }

    if(which.spawnicon != 0) {
        var newProgIcon = document.createElement("button");
        newProgIcon.className = "programicon";
        newProgIcon.id = which.id;
        newProgIcon.innerHTML = `
            <img src="${which.icon}" loading="lazy" alt="">
            <p>${which.title}</p>
        `;
        newProgIcon.addEventListener("click", function() {
            run(this.id);
        });

        objects.progicons.appendChild(newProgIcon);
    }
}

function addProgramIconToFolder(which) {
    savefile(system.user.paths.programShortcuts + (which.title).replaceAll("'", "&#39;") + ".run", JSON.stringify(which), 1, "run")
}




function ifjsonparse(which) { // Parse JSON but only if valid
    try {
        JSON.parse(which);
    } catch (e) {
        return {};
    }
    return JSON.parse(which);
}




function vari(which) {
    if (which == "username") {
        return (setting.username);
    }
    if (which.indexOf("path.") > -1) {
        if (which.indexOf("path.user") > -1) {
            if (which == "path.user.settings") {
                return ("C:/users/" + vari("username") + "/settings");
            }
        }
    }
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



function gooff() { // Shutdown MainOS
    // TODO: Add check so it can't be run by every program
    window.close();
    self.close();
}


function wait(time) { //deprecated
    // TODO: Remove function
    if (time > 500) {
        time = 0;
        console.warn("function wait(): Waiting time may only be 500ms or less.");
    }
    var starttime = new Date().getTime();

    while(new Date().getTime() < starttime + time) {}

    console.warn("function wait() is depreciated. Please remove this function from your code.");
}





objects.taskbartime = document.getElementById("taskbartime");

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
    objects.taskbartime.innerHTML = setting.time.hour + ":" + setting.time.minute;
}, 250);


function enterFullscreen(element) { // Toggle MainOS Fullscreen
    if(document.fullscreenElement == null || document.fullscreenElement == undefined) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else {
            element.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}


if (system.user.settings.default_fullscreen == 1) { // Enter fullscreen on start if requested by setting
    document.body.getElementsByClassName("content")[0].addEventListener("click", function() {
        enterFullscreen(document.body);
    }, {"once": true});
}


document.getElementById("background").style.backgroundImage = "url(" + loadfile(system.user.settings.backgroundImage) + ")"; // Load Desktop Background
document.getElementById("username").innerText = system.user.name; // Display username on desktop

// Check space on disk
savefile("C:/.diskinfo/size_used.txt", JSON.stringify(localStorage).length / 1000, 1, "t=txt");
savefile("C:/.diskinfo/size_remaining.txt", loadfile("C:/.diskinfo/size.txt") - loadfile("C:/.diskinfo/size_used.txt"), 1, "t=txt");

// Re-Create program shortcuts; Delete them beforehand
listdir(system.user.paths.programShortcuts).forEach((item) => {
    deletefile(item, 1);
})




// Task List
function refreshTaskList() {
    document.getElementById("tasklist").innerHTML = "";
    for(var i = 0; i < pid.length; i++) {
        myProgram = pid[i];
        if(myProgram != undefined && myProgram != "" && system.user.programs[myProgram].spawnicon != 0) {
            var myNewChildNode1 = document.createElement("button");
            var myNewChildNode2 = document.createElement("img");
            myNewChildNode2.src = system.user.programs[myProgram].icon;
            myNewChildNode2.alt = "";
            myNewChildNode1.appendChild(myNewChildNode2);

            myNewChildNode3 = document.createElement("span");
            myNewChildNode3.innerHTML = system.user.programs[myProgram].title;

            myNewChildNode1.appendChild(myNewChildNode3);

            myNewChildNode1.setAttribute("pid", i)

            myNewChildNode1.addEventListener("click", function() {
                
                if(this.classList.contains("active")) {
                    setWindowMinimized(getWindowByMagic(this.getAttribute("pid")));
                } else {
                    setWindowMinimized(getWindowByMagic(this.getAttribute("pid")), false);
                    focusWindow(getWindowByMagic(this.getAttribute("pid")));
                }
                
            });

            // myNewChildNode1.addEventListener("mouse", function() {
            //     focusWindow(document.getElementById(this.getAttribute("pid")));
            // });

            // myNewChildNode1.onclick = focusWindow(i);

            document.getElementById("tasklist").appendChild(myNewChildNode1);
        }
    }
}
