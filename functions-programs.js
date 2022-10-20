function getProcessList() {
    return(processList);
}

function newProcessListEntry(programIdentifier) {
    if(!processList.length>0) {
        processList.push(null);
    }
    processList.push(programIdentifier);
    pidmax = processList.length - 1;
    return(pidmax);
}

/**
 * Runs a program
 * @param {string} which program identifier
 * @param iattr launch parameters / attributes
 * @param how defines if program should be launched windowed or maximized
 */
function run(which, iattr, how) { // Run a program
    let myPid = newProcessListEntry(which);
    let myProgram = program[which];
    if(!checkMayStillOpen(which)) {
        processList[myPid] = null;
        return;
    }

    let newWindow = document.createElement("div");
    newWindow.classList.add("program");
    newWindow.id = myPid;
    if(myProgram.noborder) {
        newWindow.classList.add("noborder");
    }

    objects.programs.appendChild(newWindow);

    let myWindow = newWindow;

    if(!myProgram.icon) {myProgram.icon = "#iofs:C:/mainos/system32/icons/transparent.png"}; // Set default icon

    myWindow.innerHTML = `
    <div class="headbar">
        <img class="progicon" src="${myProgram.icon}" alt="${myProgram.title}">
        <p class="progtitle">${myProgram.title}</p>
        <button class="max has_hover" onclick="focusWindow(getWindowByMagic(this)); max(getWindowByMagic(this))" href="#" title="(Un-)Maximize">⎚</button>
        <button class="close has_hover" onclick="unrun(getWindowByMagic(this))" href="#" title="Close"><b>x</b></button>
        <button class="minimize" onclick="setWindowMinimized(getWindowByMagic(this))">-</button>
        <button class="fullscreen has_hover" onclick="windowFullscreen(getWindowByMagic(this))" href="#" title="Toggle Fullscreen">
            <img src="${loadfile("C:/mainos/system32/icons/fullscreen.svg")}" alt="">
        </button>
        <div class="drag"></div>
    </div>
    <div class="resizers">
        <div class="resizer2"></div>
    </div>
    <iframe class="proframe ${myProgram.id}" src="about:blank" pid="${myPid}" async>${myProgram.src}</iframe>
    `;

    myWindow.frame = myWindow.children[2];
    myWindow.drag = myWindow.children[0].getElementsByClassName("drag")[0];
    myWindow.resizer2 = myWindow.getElementsByClassName("resizer2")[0];

    if(myProgram.sandbox) {
        myWindow.classList.add("sandbox");
        if(myProgram.sandbox == 1) {
            myWindow.classList.add("sandbox_l1");
            myWindow.frame.sandbox = "allow-scripts allow-forms allow-pointer-lock allow-same-origin"
        }
        if(myProgram.sandbox == 1) {
            myWindow.classList.add("sandbox_l2");
            myWindow.frame.sandbox = "allow-scripts allow-forms";
        }
    }


    myWindow.drag.addEventListener("mousemove", function(event) {
        if(clicking == 1 && !myWindow.classList.contains("maximized")) {
            overlayDragBar(this, true);
            dragWindow(getWindowByMagic(myWindow), pos.mouse.x , pos.mouse.y, (myWindow.offsetLeft + event.clientX), (myWindow.offsetTop + event.clientY));
        } else {
            overlayDragBar(this, false);
        }
    });

    myWindow.resizer2.addEventListener("mousemove", function(event) {
        if(clicking == 1) {
            overlayResizer(this, true);
            resizeWindow(getWindowByMagic(myWindow), event.clientX - myWindow.offsetLeft, event.clientY - myWindow.offsetTop);
        } else {
            overlayResizer(this, false);
        }
    });

    myWindow.drag.addEventListener("mousedown", function() {
        clicking = 1;
        focusWindow(getWindowByMagic(myWindow));
        overlayDragBar(this, true);
        this.addEventListener("mouseup", function() {
            clicking = 0;
            overlayDragBar(this, false);
        }, {"once": true})
    });

    myWindow.resizer2.addEventListener("mousedown", function() {
        clicking = 1;
        focusWindow(getWindowByMagic(myWindow));
        overlayResizer(this, true);
        this.addEventListener("mouseup", function() {
            clicking = 0;
            overlayResizer(this, false);
        }, {"once": true})
    });

    myWindow.drag.addEventListener("touchmove", function(event) {
        if(clicking == 1 && !myWindow.classList.contains("maximized")) {
            overlayDragBar(this, true);
            dragWindow(getWindowByMagic(myWindow), pos.mouse.x , pos.mouse.y, (myWindow.offsetLeft + event.targetTouches[0].clientX), (myWindow.offsetTop + event.targetTouches[0].clientY));
        } else {
            overlayDragBar(this, false);
        }
    });

    myWindow.resizer2.addEventListener("touchmove", function(event) {
        if(clicking == 1) {
            overlayResizer(this, true);
            resizeWindow(getWindowByMagic(myWindow), event.targetTouches[0].clientX - myWindow.offsetLeft, event.targetTouches[0].clientY - myWindow.offsetTop);
        } else {
            overlayResizer(this, false);
        }
    });

    myWindow.drag.addEventListener("touchstart", function() {
        clicking = 1;
        focusWindow(getWindowByMagic(myWindow));
        overlayDragBar(this, true);
        this.addEventListener("touchend", function() {
            clicking = 0;
            overlayDragBar(this, false);
        }, {"once": true})
    });

    myWindow.resizer2.addEventListener("touchstart", function() {
        clicking = 1;
        focusWindow(getWindowByMagic(myWindow));
        this.addEventListener("touchend", function() {
            clicking = 0;
            overlayResizer(this, false);
        }, {"once": true})
    });


    myWindow.drag.addEventListener("dblclick", function() {
        focusWindow(getWindowByMagic(myWindow));
        max(getWindowByMagic(this));
    });


    // Display once we're done
    myWindow.style = "display:inline";
    myWindow.style.opacity = "1";
    myWindow.style.display = "inline";


    myWindow.frame.src = myWindow.frame.innerHTML;
    myWindow.frame.pid = myPid;
    
    // pass pid to iframe
    

    if (!how) {
        max(getWindowByMagic(myWindow), "tomax");
    } else if(how == "min" || how == "minimized" || how == "minimised" || how == "background") {
        setWindowMinimized(getWindowByMagic(myWindow));
    }

    attr = iattr; // Will get used to pass arguments to programs when starting them // Deprecated - use getProgramArgs(this) instead

    myWindow.frame.data = {};
    myWindow.frame.data.mypid = myPid;
    myWindow.frame.contentWindow.pid = myPid;
    myWindow.frame.contentWindow.os = myWindow.frame.contentWindow.mainos = this.window;

    myWindow.frame.contentWindow.osWindow = {
        "pid": myPid,
        "attributes": iattr,
        "programObject": myProgram,
        "path": {
            "folderOfExecutable": myProgram.src.split("/").slice(0, -1).join("/"),
            "executable": myProgram.src,
            "folder": path.programFiles + myProgram.id + "/",
            "data": path.appdata + myProgram.id + "/",
        },
        "os": this.window,
        "mainos": this.window
    };


    // myWindow.frame.contentWindow.window.alert = notification;
    // myWindow.frame.contentWindow.alert = notification;
    myWindow.frame.contentWindow.document.documentElement.style.setProperty("--font", setting.font);

    refreshTaskList();
    focusWindow(getWindowById(myWindow.id));


    function checkMayStillOpen(programIdentifier) {
        let myProgram = program[programIdentifier];
        if(!myProgram.maxopen) {
            return true; // No limit
        }
        let stillOpenable = myProgram.maxopen + 1;
    
        for(let processListEntry of getProcessList()) {
            if(processListEntry == programIdentifier) {
                stillOpenable--;
            }
        }
    
        if(stillOpenable > 0) {
            return true;
        } else {
            return false;
        }
    }
}


/**
 * focusses a window
 * @param which which window to focus
 */
function focusWindow(which) {
    zindex++;
    which.style.zIndex = zindex;
    which.children[2].focus();


    if(which.classList.contains("minimized")) {
        setWindowMinimized(which, false);
    }

    unfocusWindow();

    which.classList.add("active");

    for(myTask of document.getElementById("tasklist").children) {
        if(myTask.getAttribute("pid") == which.id) {
            myTask.classList.add("active");
        }
    }
}

function unfocusWindow() {
    for(myWindow of document.getElementsByClassName("program")) {
        if(myWindow.classList.contains("active")) {
            myWindow.classList.remove("active");
        }
    }

    for(myTask of document.getElementById("tasklist").children) {
        if(myTask.classList.contains("active")) {
            myTask.classList.remove("active");
        }
    }
}

/**
 * Positions a window at a specific position
 * @param which which window
 * @param {number} x x coordinates
 * @param {number} y y coordinates
 * @param {number} [offsetX] offset
 * @param {number} [offsetY] offset
 */
function dragWindow(which, x, y, offsetX = 0, offsetY = 0) {
    which.style.left = offsetX - x + "px";
    which.style.top = offsetY - y + "px";
}

/**
 * Resizes a window
 * @param which which window
 * @param {number} width 
 * @param {number} height 
 */
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

/**
 * Closes a program
 * @param which program
 */
function unrun(which) { // Unrun / close a program
    which.classList.add("closing");

    setTimeout(function() {
        which.style.zIndex = "0";
        which.style.display = "none";
        which.children[2].src = "about:blank";
        which.outerHTML = "";
        processList[+which.id] = null;
        refreshTaskList();

    }, 250);
}

/**
 * Maximizes or windowes a window
 * @param which window
 * @param how maximize or unmaximize
 */
function max(which, how) { // Maximize or unmaximize window
    which.style.transition = ".3s";
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

    if(which.classList.contains("minimized")) {
        setWindowMinimized(which, false);
    }

    setTimeout(function() {
        which.style.transition = "0s";
    }, 300);
}


/**
 * Minimizes or unminimizes a window
 * @param which window
 * @param {boolean} state minimize / unminimize (default: auto)
 */
function setWindowMinimized(which, state) {

    if(state == true) {
        which.classList.add("minimized");
        which.getElementsByTagName("iframe")[0].setAttribute("disabled", true);
        unfocusWindow();
    } else if(state == false) {
        which.getElementsByTagName("iframe")[0].removeAttribute("disabled");
        which.classList.remove("minimized");

    } else {
        setWindowMinimized(which, !which.classList.contains("minimized"));
        return;
    }
}

/**
 * Minimizes all windows
 */
function showDesktop() {
    for(let i = 0; i < pid.length; i++) {
        if(pid[i] != "" && pid[i] != undefined) {
            setWindowMinimized(getWindowById(i), true);
        }
    }
}

/**
 * Toggles a window's fullscreen mode
 * @param which window
 */
function windowFullscreen(which) {
    which.style.transition = ".5s";
    which.classList.toggle("fullscreen");
    window.setTimeout(function() {
        which.style.transition = "";
    },500);
}


/**
 * Returns a window by id
 * @param {number} id
 * @returns {object} window
 */
function getWindowById(id) {
    return document.getElementById(id);
}

/**
 * Returns a window by its child elements
 * @param {object} which
 * @returns {object} window
 */
function getWindowByChildElement(which) {
    if(which != undefined) {
        if(which?.classList?.contains("program")) {
            return which;
        } else {
            return getWindowByChildElement(which.parentElement);
        }
    }
}

function getWindowsByName(which) {
    const result = document.getElementsByClassName(which);
    return result;
}

function getWindowByMagic(which) {
    var result;
    if(result == undefined || result == null || result == "") {
        result = getWindowById(which);
    }
    if(result == undefined || result == null || result == "") {
        result = getWindowByChildElement(which);
    }
    if(result == undefined || result == null || result == "") {
        if(which?.osWindow?.pid) {
            result = getWindowById(which.osWindow.pid);
        }
    }
    return result;
}

function getProgramByMagic(which) {
    return program[pid[getWindowByMagic(which).id]].id;
}