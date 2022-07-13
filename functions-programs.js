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

        mypid.innerHTML = "<div class=\"headbar\"></div><div class=\"resizers\"></div><iframe class=\"proframe " + thisprogram.id + "\" src=\"about:blank\" async>" + thisprogram.src + "</iframe>";

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

    mypid.children[0].innerHTML = "<img class=\"progicon\" src=\"" + thisprogram.icon + "\" alt=\"" + thisprogram.title + "\"/><p class=\"progtitle\">" + thisprogram.title + "</p><button onclick=\"focusWindow(this.parentElement.parentElement); max(this)\" href='#' title='(Un-)Maximize' class=\"max has_hover\">⎚</button><button onclick=\"unrun(this)\" href='#' title='Close' class=\"close has_hover\"><b>x</b></button><button onclick=\"windowFullscreen(this.parentElement.parentElement)\" href='#' title='Fullscreen' class=\"fullscreen has_hover\"><img src=\""+loadfile("C:/mainos/system32/icons/fullscreen.svg")+"\" alt=\"\"></button><div class=\"drag\"></div>"; // Todo: Add screenreader text; <button class=\"min\">🗕︎</button>
    mypid.children[1].innerHTML = "<div class=\"resizer2\"></div>";


    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("mousemove", function(event) {
        if(clicking == 1 && !mypid.classList.contains("maximized")) {
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
        focusWindow(mypid);
        overlayDragBar(this, true);
        this.addEventListener("mouseup", function() {
            clicking = 0;
            overlayDragBar(this, false);
        }, {"once": true})
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("mousedown", function() {
        clicking = 1;
        focusWindow(mypid);
        overlayResizer(this, true);
        this.addEventListener("mouseup", function() {
            clicking = 0;
            overlayResizer(this, false);
        }, {"once": true})
    });



    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("touchmove", function(event) {
        if(clicking == 1 && !mypid.classList.contains("maximized")) {
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
        focusWindow(mypid);
        overlayDragBar(this, true);
        this.addEventListener("touchend", function() {
            clicking = 0;
            overlayDragBar(this, false);
        }, {"once": true})
    });

    mypid.getElementsByClassName("resizer2")[0].addEventListener("touchstart", function() {
        clicking = 1;
        focusWindow(mypid);
        this.addEventListener("touchend", function() {
            clicking = 0;
            overlayResizer(this, false);
        }, {"once": true})
    });


    mypid.children[0].getElementsByClassName("drag")[0].addEventListener("dblclick", function() {
        focusWindow(mypid);
        max(this);
    });


    mypid.style = "display:inline";
    mypid.style.opacity = "1";
    mypid.style.display = "inline";
    mypid.children[2].src = mypid.children[2].innerHTML;

    if (!how) {
        max(mypid.children[0].children[0], "tomax");
    }


    attr = iattr; // Will get used to pass arguments to programs when starting them

    mypid.children[2].contentWindow.window.alert = notification;
    mypid.children[2].contentWindow.alert = notification;
    mypid.children[2].contentWindow.document.documentElement.style.setProperty("--font", setting.font);

    refreshTaskList();
    focusWindow(mypid);
    window.setTimeout(function() {
        focusWindow(mypid);
    }, 260)
}

/**
 * focusses a window
 * @param which which window to focus
 */
function focusWindow(which) {
    zindex++;
    which.style.zIndex = zindex;
    which.children[2].focus();


    for(myTask of document.getElementById("tasklist").children) {
        if(myTask.getAttribute("pid") == which.id) {
            myTask.classList.add("active");
        } else {
            if(myTask.classList.contains("active")) {
                myTask.classList.remove("active");
            }
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
        refreshTaskList();

    }, 250);
}

/**
 * Maximizes or windowes a window
 * @param which window
 * @param how maximize or unmaximize
 */
function max(which, how) { // Maximize or unmaximize window
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

/**
 * Toggles a window's fullscreen mode
 * @param which window
 */
function windowFullscreen(which) {
    which.style.transition = "1s";
    which.classList.toggle("fullscreen");
    window.setTimeout(function() {
        which.style.transition = "";
    },1000);
}
