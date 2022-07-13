var objects = {};
var pos = {};
pos.mouse = {};
pos.relative = {};
var zindex = 10;
var register = [];
var timer1;
var thisprogram = {};
var program = {};
var clicked1 = 0;
var pid = [];
var pidmax = 10;

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


try {
    mainos = Object.assign(mainos, ifjsonparse(loadfile("C:/mainos/system32/vars.dat")));
} catch (e) {

    objs = [mainos, ifjsonparse(loadfile("C:/mainos/system32/vars.dat"))];
    result = objs.reduce(function(r, o) {
        Object.keys(o).forEach(function(k) {
            r[k] = o[k];
        });
        mainos = r;
    }, {});
}


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
    setting.temp.toautostart = [];

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
        xhr.open("GET", mainos.repository, false); // TODO: Make async
        xhr.onload = function() {
            program = Object.assign(program, ifjsonparse((xhr.responseText)));
        }
        xhr.send();

    } catch (e) {}

}



for (var i = 0; Object.keys(program).length > i; i++) {

    // TODO: Scan program code and check for harmful code like direct access to localStorage. Save hash + version and only rescan if hash changed. If harmful code is found, notify user and don't spawn icon

    thisprogram = program[Object.keys(program)[i]]; // The program we are checking meta for currently


    if (thisprogram.src && thisprogram.src.includes("//")) {
        // Don't request from external programs. Normally this would result in access denied
        // TODO: Find a way
    } else {

        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", thisprogram.src, false); // TODO: Make async - Probably requires further changes in the core
            xhr.onload = function () {
                var thisprogramMeta = (xhr.responseText).substr(0, 1200); // Everything relevant to us has to be within the first 1200 chars (Performance reasons)
                if (thisprogramMeta && thisprogramMeta.includes("<head>") && thisprogramMeta.includes("</head>")) { // Only continue if <head>-section doesn't exceed maximum length and has both start- and ending tags
                    thisprogramMeta = thisprogramMeta.split("<head>")[1].split("</head>")[0]; // Extract everything between <head>*</head>
                    thisprogramMeta = thisprogramMeta.replace(/\n|\r|\t/g, ''); // Remove empty lines and tabs
                    thisprogramMeta = thisprogramMeta.split(new RegExp("\<")); // Split into array

                    for (var i = 0; i < thisprogramMeta.length; i++) {

                        if (thisprogramMeta[i].indexOf("/") == 0) { // Skip ending-tags
                            continue;
                        } else if(thisprogramMeta[i].indexOf("script") == 0 || thisprogramMeta[i].indexOf("style") == 0) { // Skip scripts and inline styles
                            continue;
                        }


                        if (thisprogramMeta[i].toLowerCase().includes("meta")) { // Meta Tags
                            if (thisprogramMeta[i].toLowerCase().includes("version")) {
                                thisprogram.version = (thisprogramMeta[i].split("version=\"")[1].split("\"")[0]);
                            }
                        } else if (thisprogramMeta[i].toLowerCase().includes("link")) { // Link Tags
                            if (thisprogramMeta[i].toLowerCase().includes("shortcut icon")) { // Favicon
                                thisprogram.icon = (thisprogramMeta[i].split("href=\"")[1].split("\"")[0]);
                            }
                        } else if (thisprogramMeta[i].toLowerCase().includes("title")) { // Title
                            thisprogram.title = (thisprogramMeta[i].split(">")[1].split("<")[0]);
                        }
                    }

                } else {
                    console.error("Problems with <head>-Tag in exec.html of program with id: " + thisprogram.id + "; src: " + thisprogram.src + ". Refusing to read meta data. \nMaybe it exceeds 1200 characters or is malformed?");

                    thisprogram.version = 0;
                    thisprogram.icon = "";
                    thisprogram.title = thisprogram.id + " - Check error log";

                    thisprogram.hasErrors = true;
                }

            }
            xhr.send();

        } catch (e) {}

    }


    if (thisprogram.devonly == 1) {
        if (setting.developer == 0) {
            continue;
        }
    }

    if (thisprogram.germantv == 1) {
        if (setting.german_tv != 1 || setting.language != "de") {
            continue;
        }
    }




    if (thisprogram.spawnicon != 0) {
        objects.progicons.innerHTML = objects.progicons.innerHTML + "<button id='icon1' onclick=\"run('" + thisprogram.id + "');\"><img src='" + thisprogram.icon + "' /><p>" + thisprogram.title + "</p></button>";
    }

    if (thisprogram.autostart == 1) {
        setting.temp.toautostart.push(thisprogram.id);
    }
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


function enterFullscreen(element) { // Make MainOS Fullscreen
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}


if (setting.default_fullscreen == 1) { // Enter fullscreen on start if requested by setting
    enterFullscreen(document.body);
}



document.getElementById("background").style.backgroundImage = "url(" + setting.backgroundimage + ")"; // Load Desktop Background

setTimeout(function() { // Run Autostart programs
    for (i = 0; i < setting.temp.toautostart.length; i++) {
        run(setting.temp.toautostart[i]);
    }
}, 500);

function notification(title, content) { // Send notification

    if (document.getElementsByClassName("notifications")[0] != null) {
        document.getElementsByClassName("notifications")[0].contentWindow.send_notification(title, content);
    } else {
        run("notifications", {
            "title": title,
            "content": content
        });
    }
}
window.alert = notification;

// Check space on disk
savefile("C:/.diskinfo/size_used.txt", JSON.stringify(localStorage).length / 1000, 1, "t=txt");
savefile("C:/.diskinfo/size_remaining.txt", loadfile("C:/.diskinfo/size.txt") - loadfile("C:/.diskinfo/size_used.txt"), 1, "t=txt");

// Re-Create program shortcuts; Delete them beforehand
listdir("C:/users/" + setting.username + "/programs/").forEach((item) => {
    deletefile(item, 1);
})


Object.keys(program).forEach((item) => {
    var myTitle = program[item].title;
    myTitle = myTitle.replaceAll("'", "&#39;");
    savefile("C:/users/" + setting.username + "/programs/" + myTitle + ".run", JSON.stringify(program[item]), 1, "run");
});



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
                }
                focusWindow(getWindowByMagic(this.getAttribute("pid")));

            });

            // myNewChildNode1.addEventListener("mouse", function() {
            //     focusWindow(document.getElementById(this.getAttribute("pid")));
            // });

            // myNewChildNode1.onclick = focusWindow(i);

            document.getElementById("tasklist").appendChild(myNewChildNode1);
        }
    }
}
