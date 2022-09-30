/**
 * Runs a program
 * @param {string} which program identifier
 * @param iattr launch parameters / attributes
 * @param how defines if program should be launched windowed or maximized
 */
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

    if(!thisprogram.icon) { // Add fallback image to avoid errors
        thisprogram.icon = "iofs:C:/mainos/system32/icons/transparent.png";
    }

        mypid.innerHTML = `
        <div class="headbar">
            <img class="progicon" src="${thisprogram.icon}" alt="${thisprogram.title}">
            <p class="progtitle">${thisprogram.title}</p>
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
        <iframe class="proframe ${thisprogram.id}" src="about:blank" async>${thisprogram.src}</iframe>
        `;

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



    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("mousemove", function(event) {
        if(clicking == 1 && !mypid.classList.contains("maximized")) {
            overlayDragBar(this, true);
            dragWindow(getWindowByMagic(mypid), pos.mouse.x , pos.mouse.y, (mypid.offsetLeft + event.clientX), (mypid.offsetTop + event.clientY));
        } else {
            overlayDragBar(this, false);
        }
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("mousemove", function(event) {
        if(clicking == 1) {
            overlayResizer(this, true);
            resizeWindow(getWindowByMagic(mypid), event.clientX - mypid.offsetLeft, event.clientY - mypid.offsetTop);
        } else {
            overlayResizer(this, false);
        }
    });

    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("mousedown", function() {
        clicking = 1;
        focusWindow(getWindowByMagic(mypid));
        overlayDragBar(this, true);
        this.addEventListener("mouseup", function() {
            clicking = 0;
            overlayDragBar(this, false);
        }, {"once": true})
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("mousedown", function() {
        clicking = 1;
        focusWindow(getWindowByMagic(mypid));
        overlayResizer(this, true);
        this.addEventListener("mouseup", function() {
            clicking = 0;
            overlayResizer(this, false);
        }, {"once": true})
    });



    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("touchmove", function(event) {
        if(clicking == 1 && !mypid.classList.contains("maximized")) {
            overlayDragBar(this, true);
            dragWindow(getWindowByMagic(mypid), pos.mouse.x , pos.mouse.y, (mypid.offsetLeft + event.targetTouches[0].clientX), (mypid.offsetTop + event.targetTouches[0].clientY));
        } else {
            overlayDragBar(this, false);
        }
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("touchmove", function(event) {
        if(clicking == 1) {
            overlayResizer(this, true);
            resizeWindow(getWindowByMagic(mypid), event.targetTouches[0].clientX - mypid.offsetLeft, event.targetTouches[0].clientY - mypid.offsetTop);
        } else {
            overlayResizer(this, false);
        }
    });

    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("touchstart", function() {
        clicking = 1;
        focusWindow(getWindowByMagic(mypid));
        overlayDragBar(this, true);
        this.addEventListener("touchend", function() {
            clicking = 0;
            overlayDragBar(this, false);
        }, {"once": true})
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("touchstart", function() {
        clicking = 1;
        focusWindow(getWindowByMagic(mypid));
        this.addEventListener("touchend", function() {
            clicking = 0;
            overlayResizer(this, false);
        }, {"once": true})
    });


    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("dblclick", function() {
        focusWindow(getWindowByMagic(mypid));
        max(getWindowByMagic(this));
    });


    // Display once we're done
    mypid.style = "display:inline";
    mypid.style.opacity = "1";
    mypid.style.display = "inline";
    mypid.children[2].src = mypid.children[2].innerHTML;

    if (!how) {
        max(getWindowByMagic(mypid), "tomax");
    }


    attr = iattr; // Will get used to pass arguments to programs when starting them

    mypid.children[2].contentWindow.window.alert = notification;
    mypid.children[2].contentWindow.alert = notification;
    mypid.children[2].contentWindow.document.documentElement.style.setProperty("--font", setting.font);

    refreshTaskList();
    focusWindow(getWindowById(mypid.id));
}

/**
 * focusses a window
 * @param which which window to focus
 */
function focusWindow(which) {
    zindex++;
    which.style.zIndex = zindex;
    which.children[2].focus();


    // if(which.classList.contains("minimized")) {
    //     setWindowMinimized(which, false);
    // }

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
        pid[Number(which.id)] = "";
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

    setTimeout(function() {
        which.style.transition = "0s";
    }, 300);
}

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

function getWindowByMagic(which) {
    var result;
    if(result == undefined) {
        result = getWindowById(which);
    }
    if(result == undefined) {
        result = getWindowByChildElement(which);
    }
    if(result == undefined) {
        if(which?.data?.mypid) {
            result = getWindowById(which.data.mypid);
        }
    }
    return result;
}
