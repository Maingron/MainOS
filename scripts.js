var objects = {};
var pos = {};
pos.mouse = {};
pos.relative = {};
var zindex = 10;
var register = [];
var timer1;
var program = {};
var clicked1 = 0;
var pid = [];
var pidmax = 10;
const documentRoot = location.pathname;

var path = {
    "system": "C:/mainos/",
    "sysicons": "C:/mainos/system32/icons/",
    "user": "C:/users/User/",
    "programFiles": "C:/Program Files/",
    "appdata": "C:/users/"+setting.username+"/appdata/"
}
var appdata = path.appdata; // deprecated


var clicking = 0;
var clicked = 0;

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
    document.head.getElementsByTagName("meta").namedItem("theme-color").content = setting.themecolor;
    document.head.getElementsByTagName("meta").namedItem("msapplication-TileColor").content = setting.themecolor;
}

function loadsettings() {
    setting.username = loadfile("C:/mainos/system32/settings/username.txt");
    setting.userpath = "C:/users/" + setting.username + "/";
    setting.userdata = setting.userpath + "Program Data/";
    setting.settingpath = "C:/users/" + setting.username + "/settings/";
    setting.time = new Date();


    function loadsetting(which) {
        return loadfile(setting.settingpath + which + ".txt");
    }

    setting.backgroundimage = loadsetting("backgroundimage");
    setting.developer = loadsetting("developer");
    setting.themecolor = loadsetting("themecolor");
    setting.themecolor2 = loadsetting("themecolor2");
    setting.notsodarkmode = loadsetting("notsodarkmode");
    setting.hovercolor = loadsetting("hovercolor");
    setting.hovercolornontransparent = loadsetting("hovercolornontransparent");
    setting.borderradius = loadsetting("borderradius") + "px";
    setting.tts = loadsetting("tts");
    setting.font = loadsetting("font");
    setting.repository = loadsetting("repository");
    setting.big_buttons = loadsetting("big_buttons");
    setting.default_fullscreen = loadsetting("default_fullscreen");
    setting.language = loadsetting("language");
    setting.german_tv = loadsetting("german_tv");
    setting.temp = {};

    document.documentElement.style.setProperty("--themecolor", setting.themecolor);
    document.documentElement.style.setProperty("--themecolor2", setting.themecolor2);
    document.documentElement.style.setProperty("--font", setting.font);

    document.documentElement.style.setProperty("--hovercolor",setting.hovercolor);
    document.documentElement.style.setProperty("--hovercolornontransparent",setting.hovercolornontransparent);



    if (setting.developer == 1) {
        document.getElementById("start").children[0].style.color = "#000";
    }

    objects.taskbarlanguage.innerHTML = setting.language; // Show language in taskbar

    setDocumentMeta();
}

loadsettings();

program = JSON.parse(loadfile("C:/mainos/programs.dat"));

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


if (setting.repository == 1) { // Load programs from repository if repository is enabled
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", mainos.repository, true); // TODO: Make async
        xhr.onload = function() {
            // program = Object.assign(program, ifjsonparse((xhr.responseText)));
            const repoList = ifjsonparse(xhr.responseText);
            setTimeout(function() {
                for (let i in repoList) {
                    program[i] = repoList[i];
                    loadProgramMetadata(repoList[i]);
                }
            }, 100)

        }
        xhr.send();

    } catch (e) {}

}


// Add / handle programs
for(var i = 0; i < Object.keys(program).length; i++) {
    var myProgram = program[Object.keys(program).sort()[i]];
    loadProgramMetadata(myProgram);
}


function loadProgramMetadata(which) { // Load program metadata from program file and handle some other stuff
    if(typeof(which) == "string") {
        which = program[which];
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
    if(which.devonly && !setting.developer) {
        return;
    }
    if(which.germantv && setting.german_tv != 1) {
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
    savefile("C:/users/" + setting.username + "/programs/" + (which.title).replaceAll("'", "&#39;") + ".run", JSON.stringify(which), 1, "run");
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
    pos.mouse.x = e.clientX;
    pos.mouse.y = e.clientY;
});

window.addEventListener("touchmove", function(e) {
    pos.mouse.x = e.targetTouches[0].pageX;
    pos.mouse.y = e.targetTouches[0].pageY;
});

window.addEventListener("touchstart", function(e) {
    pos.mouse.x = e.targetTouches[0].pageX;
    pos.mouse.y = e.targetTouches[0].pageY;
});

window.addEventListener("mouseup", function() {
    clearInterval(timer1);
    clicking = 0;
});

window.addEventListener("touchend", function() {
    clearInterval(timer1);
    clicking = 0;
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


if (setting.default_fullscreen == 1) { // Enter fullscreen on start if requested by setting
    window.addEventListener("click", function() {
        enterFullscreen(document.body);
    }, {"once": true});
}



document.getElementById("background").style.backgroundImage = "url(" + setting.backgroundimage + ")"; // Load Desktop Background


// Check space on disk
savefile("C:/.diskinfo/size_used.txt", JSON.stringify(localStorage).length / 1000, 1, "t=txt");
savefile("C:/.diskinfo/size_remaining.txt", loadfile("C:/.diskinfo/size.txt") - loadfile("C:/.diskinfo/size_used.txt"), 1, "t=txt");

// Re-Create program shortcuts; Delete them beforehand
listdir("C:/users/" + setting.username + "/programs/").forEach((item) => {
    deletefile(item, 1);
})




// Task List
function refreshTaskList() {
    document.getElementById("tasklist").innerHTML = "";
    for(var i = 0; i < pid.length; i++) {
        myProgram = pid[i];
        if(myProgram != undefined && myProgram != "" && program[myProgram].spawnicon != 0) {
            var myNewChildNode1 = document.createElement("button");
            var myNewChildNode2 = document.createElement("img");
            myNewChildNode2.src = program[myProgram].icon;
            myNewChildNode2.alt = "";
            myNewChildNode1.appendChild(myNewChildNode2);

            myNewChildNode3 = document.createElement("span");
            myNewChildNode3.innerHTML = program[myProgram].title;

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
