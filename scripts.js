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




function run(which, iattr, how) { // Run a program
    pidmax++;
    thisprogram = program[which];
    if (thisprogram.maxopen == "undefined") {
        thisprogram.maxopen = 100;
    }
    var maystillopen = thisprogram.maxopen;

    if (thisprogram.maxopen < 100) {
        for (i = 0; i < pid.length; i++) {
            if (pid[i] == which) {
                maystillopen--;
            }
            if (maystillopen <= 0) {
                return;
            }
        }
    }



    pid[pidmax] = which;


    var spawnprog;

    if (thisprogram.noborder != 1) {
        spawnprog = document.createElement("div");
        spawnprog.classList.add("program");
        spawnprog.id = pidmax;
        objects.programs.appendChild(spawnprog);
    } else {
        spawnprog = document.createElement("div");
        spawnprog.classList.add("program");
        spawnprog.classList.add("noborder");
        spawnprog.id = pidmax;
        if (thisprogram.isstartmenu) {
            spawnprog.classList.add("explorer_start");
        }
        objects.programs.appendChild(spawnprog);
    }

    var mypid = document.getElementById(pidmax);

    // if (thisprogram.noborder == 1) {
        // mypid.innerHTML = "<div class=\"headbar\"></div><div class=\"resizers\"></div><iframe class=\"proframe " + thisprogram.id + "\" src=\"about:blank\" async>" + thisprogram.src + "</iframe>";
    // } else {
        mypid.innerHTML = "<div class=\"headbar\"></div><div class=\"resizers\"></div><iframe class=\"proframe " + thisprogram.id + "\" src=\"about:blank\" async>" + thisprogram.src + "</iframe>";
    // }

    if (thisprogram.sandbox == 1) {
        mypid.classList.add("sandbox");
        mypid.classList.add("sandbox_l1");
        mypid.children[2].sandbox = "allow-scripts allow-forms allow-pointer-lock allow-same-origin";
    }
    if (thisprogram.sandbox == 2) {
        mypid.classList.add("sandbox");
        mypid.classList.add("sandbox_l2");
        mypid.children[2].sandbox = "allow-scripts allow-forms";
    }

    if(!thisprogram.icon) { // Add fallback image to avoid errors
        thisprogram.icon = "iofs:C:/mainos/system32/icons/transparent.png";
    }

    mypid.children[0].innerHTML = "<img class=\"progicon\" src=\"" + thisprogram.icon + "\" alt=\"" + thisprogram.title + "\"/><p class=\"progtitle\">" + thisprogram.title + "</p><button class=\"max has_hover\">⎚</button><button class=\"close has_hover\"><b>x</b></button><div class=\"drag\"></div>"; // Todo: Add screenreader text; <button class=\"min\">🗕︎</button>
    mypid.children[1].innerHTML = "<div class=\"resizer2\"></div>";


    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("mousemove", function(event) {
        if(clicking == 1) {
            overlayDragBar(this, true);
            dragWindow(mypid, pos.mouse.x , pos.mouse.y, (mypid.offsetLeft + event.clientX), (mypid.offsetTop + event.clientY));
        } else {
            overlayDragBar(this, false);
        }
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("mousemove", function(event) {
        if(clicking == 1) {
            overlayResizer(this, true);
            resizeWindow(mypid, event.clientX - mypid.offsetLeft, event.clientY - mypid.offsetTop);
        } else {
            overlayResizer(this, false);
        }
    });

    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("mousedown", function() {
        clicking = 1;
        overlayDragBar(this, true);
        this.addEventListener("mouseup", function() {
            clicking = 0;
            overlayDragBar(this, false);
        }, {"once": true})
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("mousedown", function() {
        clicking = 1;
        overlayResizer(this, true);
        this.addEventListener("mouseup", function() {
            clicking = 0;
            overlayResizer(this, false);
        }, {"once": true})
    });



    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("touchmove", function(event) {
        if(clicking == 1) {
            overlayDragBar(this, true);
            dragWindow(mypid, pos.mouse.x , pos.mouse.y, (mypid.offsetLeft + event.targetTouches[0].clientX), (mypid.offsetTop + event.targetTouches[0].clientY));
        } else {
            overlayDragBar(this, false);
        }
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("touchmove", function(event) {
        if(clicking == 1) {
            overlayResizer(this, true);
            resizeWindow(mypid, event.targetTouches[0].clientX - mypid.offsetLeft, event.targetTouches[0].clientY - mypid.offsetTop);
        } else {
            overlayResizer(this, false);
        }
    });

    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("touchstart", function() {
        clicking = 1;
        overlayDragBar(this, true);
        this.addEventListener("touchend", function() {
            clicking = 0;
            overlayDragBar(this, false);
        }, {"once": true})
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("touchstart", function() {
        clicking = 1;
        overlayResizer(this, true);
        this.addEventListener("touchend", function() {
            clicking = 0;
            overlayResizer(this, false);
        }, {"once": true})
    });



    mypid.children[0].children[3].addEventListener("click", function() {
        unrun(this);
    });

    mypid.children[0].children[2].addEventListener("click", function() {
        max(this);
    });

    mypid.style = "display:inline";
    mypid.style.opacity = "1";
    mypid.style.display = "inline";
    zindex++;
    mypid.style.zIndex = zindex;
    mypid.children[2].src = mypid.children[2].innerHTML;

    if (!how) {
        max(mypid.children[0].children[0], "tomax");
    }


    attr = iattr; // Will get used to pass arguments to programs when starting them

    mypid.children[2].contentWindow.window.alert = notification;
    mypid.children[2].contentWindow.alert = notification;
    mypid.children[2].contentWindow.document.documentElement.style.setProperty("--font", setting.font);

    mypid.children[2].focus();
}

function dragWindow(which, x, y, offsetX = 0, offsetY = 0) {
    which.style.left = offsetX - x + "px";
    which.style.top = offsetY - y + "px";
}

function resizeWindow(which, width, height) {
    which.style.width = width + "px";
    which.style.height = height + "px";
}

function overlayDragBar(which, onoff) {
    if(which.classList.contains("drag")) {
        if(onoff == false) { // Turn off
            which.style.position = "";
            which.style.zIndex = "";
        } else if(onoff == true) { // Turn on
            which.style.position = "fixed";
            which.style.zIndex = "99999";
        }
    }
}

function overlayResizer(which, onoff) {
    if(onoff == false) { // Turn off
        which.style.position = "";
        which.style.zIndex = "";
        which.style.top = "";
        which.style.left = "";
        which.style.height = "";
        which.style.width = "";
    } else if(onoff == true) { // Turn on
        which.style.position = "fixed";
        which.style.zIndex = "99999";
        which.style.top = "99999";
        which.style.left = "99999";
        which.style.height = "100%";
        which.style.width = "100%";
    }
}


function unrun(which) { // Unrun / close a program
    if (document.getElementById(which)) {
        which = document.getElementById(which); // By id (?)
    } else {
        which = which.parentElement.parentElement; // Program can close itself more easily
    }


    which.style.transition = ".5s";
    which.style.height = "50px";
    which.style.width = "100px";
    which.style.bottom = "100%";
    which.style.right = "100%";

    which.style.opacity = "0";
    setTimeout(function() {
        which.style.zIndex = "0";
        which.style.display = "none";
        which.children[2].src = "about:blank";
        document.getElementById(which.id).outerHTML = "";
        pid[Number(which.id)] = "";

    }, 250);
}


function max(which, how) { // Maximize or unmaximize program
    which = which.parentElement.parentElement;
    which.style.transition = ".5s";
    if (!how) {
        if (which.classList.contains("maximized")) {
            how = "tonormal"
        } else {
            how = "tomax"
        }
    }
    if (how == "tonormal") {
        which.classList.remove("maximized");
        which.classList.add("notmaximized");
        which.style.top = "15%";
        which.style.left = "15%";
        which.style.height = "";
        which.style.width = "";

    } else {
        which.classList.add("maximized");
        which.classList.remove("notmaximized");
        which.style.top = "0";
        which.style.left = "0";
        which.style.height = "";
        which.style.width = "";
    }

    clicking = 0;
    clicked = 1;

    setTimeout(function() {
        which.style.transition = "0s";
    }, 300);
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

