"use strict";

function getProcessList(detailed = true) {
	if(detailed) {
		let detailedList = [];
		for(let i = 0; i < processList.length; i++) {
			if(processList[i] == null) {
				continue;
			}
			detailedList.push({
				"pid": i,
				"programIdentifier": processList[i],
				get window() {
					return getWindowByPid(i);
				},
				get title() {
					let win = this.window;
					if(win) {
						return win.getElementsByClassName("progtitle")[0].innerText;
					}
				},
				get icon() {
					let win = this.window;
					if(win) {
						return win.getElementsByClassName("progicon")[0].src;
					}
				},
				get programObject() {
					return system.user.programs[this.programIdentifier];
				}
			});
		}
		return detailedList;
	} else {
		return processList;
	}
}
function newProcessListEntry(programIdentifier) {
    if(!processList.length>0) {
        processList.push(null);
    }
    processList.push(programIdentifier);
    systemRuntime.pidmax = processList.length - 1;
    return(systemRuntime.pidmax);
}


/**
 * Runs a program
 * @param {string} which program identifier
 * @param iattr launch parameters / attributes
 * @param how defines if program should be launched windowed or maximized
 */
function run(which, iattr, how) { // Run a program
    let myPid = newProcessListEntry(which);
    let myProgram = system.user.programs[which];
    if(!checkMayStillOpen(which) || myProgram.disabled) {
        processList[myPid] = null;
        return;
    }

    let newWindow = document.createElement("div");
    newWindow.classList.add("program");
    newWindow.id = myPid;
	if(myProgram.getNotifiedByEvents) {
		newWindow.setAttribute("notificationEvents", (myProgram.getNotifiedByEvents).join(" "));
	}
    newWindow.setAttribute("pid", myPid);
    if(myProgram.noborder) {
        newWindow.classList.add("noborder");
    }

    objects.programs.appendChild(newWindow);

    let myWindow = newWindow;

    tasklist.addItem(myWindow, myProgram);

    if(!myProgram.icon) {myProgram.icon = "#iofs:C:/system/icons/transparent.png"}; // Set default icon

    myWindow.innerHTML = `
    <div class="headbar">
        <img loading="lazy" class="progicon" src="${myProgram.icon}" alt="${myProgram.title}">
        <p class="progtitle">${myProgram.title}</p>
        <div class="controls">
            <button class="reload has_hover" onclick="this.parentElement.parentElement.parentElement.getElementsByClassName('proframe')[0].contentWindow.location.reload()" href="#" title="Reload program" disabled="disabled">↻</button>
            <button class="pin has_hover" onclick="setWindowAlwaysOnTop(getWindowByMagic(this))" href="#" title="Pin window always to top">📌</button>
            <button class="max has_hover" onclick="focusWindow(getWindowByMagic(this)); setWindowMaximized(getWindowByMagic(this))" href="#" title="(Un-)Maximize">⎚</button>
            <button class="close has_hover" onclick="unrun(getWindowByMagic(this))" href="#" title="Close"><b>x</b></button>
            <button class="minimize has_hover" onclick="setWindowMinimized(getWindowByMagic(this))">-</button>
            <button class="fullscreen has_hover" onclick="setWindowFullscreen(getWindowByMagic(this))" href="#" title="Toggle Fullscreen">
                <img src="#iofs:C:/system/icons/fullscreen.svg" alt="">
            </button>
        </div>
        <div class="drag"></div>
    </div>
    <div class="resizers">
        <div class="resizer2"></div>
    </div>
    <iframe class="proframe ${myProgram.id}" src="about:blank" pid="${myPid}" async>${myProgram.src}</iframe>
    `;



    // Disable disabled controls
    // TODO: Improve

    if(myProgram?.controls?.fullscreen == false) {
        myWindow.getElementsByClassName("fullscreen")[0].setAttribute("disabled", true);
    }
    if(myProgram?.controls?.minimize == false) {
        myWindow.getElementsByClassName("minimize")[0].setAttribute("disabled", true);
    }
    if(myProgram?.controls?.maximize == false) {
        myWindow.getElementsByClassName("max")[0].setAttribute("disabled", true);
    }
    if(myProgram?.controls?.close == false) {
        myWindow.getElementsByClassName("close")[0].setAttribute("disabled", true);
    }
    if(myProgram?.controls?.pin == false) {
        myWindow.getElementsByClassName("pin")[0].setAttribute("disabled", true);
    }

    if(system?.user?.settings?.developer?.enable == true) {
        myWindow.getElementsByClassName("reload")[0].removeAttribute("disabled");
    }

    myWindow.frame = myWindow.children[2];
    myWindow.drag = myWindow.children[0].getElementsByClassName("drag")[0];
    myWindow.resizer2 = myWindow.getElementsByClassName("resizer2")[0];

	if(myProgram?.controls?.resize === false) {
		myWindow.resizer2.setAttribute("disabled", "disabled");
		myWindow.resizer2.setAttribute("inert", "inert");
	}

	if(myProgram?.controls?.["bar-move"] === false) {
		myWindow.drag.setAttribute("inert", "inert");
	}

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

	if(myProgram?.controls?.["bar-move"] !== false) {
		myWindow.drag.addEventListener("mousemove", function(event) {
			if(myWindow.getAttribute("interactionlocked")) {
				return false;
			}
			if(systemRuntime.clicking == 1 && !myWindow.classList.contains("maximized")) {
				overlayDragBar(this, true);
				dragWindow(getWindowByMagic(myWindow), systemRuntime.pos.mouseX , systemRuntime.pos.mouseY, (myWindow.offsetLeft + event.clientX), (myWindow.offsetTop + event.clientY));
			} else {
				overlayDragBar(this, false);
			}
		});

		myWindow.drag.addEventListener("mousedown", function() {
			if(myWindow.getAttribute("interactionlocked")) {
				return false;
			}
			systemRuntime.clicking = 1;
			focusWindow(getWindowByMagic(myWindow));
			overlayDragBar(this, true);
			this.addEventListener("mouseup", function() {
				systemRuntime.clicking = 0;
				overlayDragBar(this, false);
			}, {"once": true})
		});

		myWindow.drag.addEventListener("touchmove", function(event) {
			if(systemRuntime.clicking == 1 && !myWindow.classList.contains("maximized")) {
				overlayDragBar(this, true);
				dragWindow(getWindowByMagic(myWindow), systemRuntime.pos.mouseX , systemRuntime.pos.mouseY, (myWindow.offsetLeft + event.targetTouches[0].clientX), (myWindow.offsetTop + event.targetTouches[0].clientY));
			} else {
				overlayDragBar(this, false);
			}
		});

		myWindow.drag.addEventListener("touchstart", function() {
			if(myWindow.getAttribute("interactionlocked")) {
				return false;
			}
			systemRuntime.clicking = 1;
			focusWindow(getWindowByMagic(myWindow));
			overlayDragBar(this, true);
			this.addEventListener("touchend", function() {
				systemRuntime.clicking = 0;
				overlayDragBar(this, false);
			}, {"once": true})
		});
	}

	if(myProgram?.controls?.["bar-dblclicktomax"] !== false) {
		myWindow.drag.addEventListener("dblclick", function() {
			if(myWindow.getAttribute("interactionlocked")) {
				return false;
			}
			focusWindow(getWindowByMagic(myWindow));
			setWindowMaximized(getWindowByMagic(this));
		});
	}

	if(myProgram?.controls?.resize !== false) {
		myWindow.resizer2.addEventListener("mousemove", function(event) {
			if(myWindow.getAttribute("interactionlocked")) {
				return false;
			}
			if(systemRuntime.clicking == 1) {
				overlayResizer(this, true);
				resizeWindow(getWindowByMagic(myWindow), event.clientX - myWindow.offsetLeft, event.clientY - myWindow.offsetTop);
			} else {
				overlayResizer(this, false);
			}
		});

		myWindow.resizer2.addEventListener("mousedown", function() {
			if(myWindow.getAttribute("interactionlocked")) {
				return false;
			}
			systemRuntime.clicking = 1;
			focusWindow(getWindowByMagic(myWindow));
			overlayResizer(this, true);
			this.addEventListener("mouseup", function() {
				systemRuntime.clicking = 0;
				overlayResizer(this, false);
			}, {"once": true})
		});


		myWindow.resizer2.addEventListener("touchmove", function(event) {
			if(systemRuntime.clicking == 1) {
				overlayResizer(this, true);
				resizeWindow(getWindowByMagic(myWindow), event.targetTouches[0].clientX - myWindow.offsetLeft, event.targetTouches[0].clientY - myWindow.offsetTop);
			} else {
				overlayResizer(this, false);
			}
		});

		myWindow.resizer2.addEventListener("touchstart", function() {
			if(myWindow.getAttribute("interactionlocked")) {
				return false;
			}
			systemRuntime.clicking = 1;
			focusWindow(getWindowByMagic(myWindow));
			this.addEventListener("touchend", function() {
				systemRuntime.clicking = 0;
				overlayResizer(this, false);
			}, {"once": true})
		});
	}


    // Display once we're done
    myWindow.style = "display:inline";
    myWindow.style.opacity = "1";
    myWindow.style.display = "inline";


    myWindow.frame.src = myWindow.frame.innerHTML;
    myWindow.frame.pid = myPid;
    
    // pass pid to iframe
    

    if (!how) {
        setWindowMaximized(getWindowByMagic(myWindow), true);
    } else if(how == "min" || how == "minimized" || how == "minimised" || how == "background") {
        setWindowMinimized(getWindowByMagic(myWindow), true);
    } else if(how == "fullscreen") {
        setWindowFullscreen(getWindowByMagic(myWindow));
    } else if(how == "max" || how == "maximized" || how == "maximised") {
        setWindowMaximized(getWindowByMagic(myWindow));
    } else if(how == "window" || how == "windowed") {
        setWindowMaximized(getWindowByMagic(myWindow), false);
    }
    attr = iattr; // Will get used to pass arguments to programs when starting them // Deprecated - use getProgramArgs(this) instead


    /**
     * hands infos to the program window.
     * This is where the variable "pWindow" originates from.
     * It will be created for each individual window when the program is started.
     *
     * This also contains some styles and other variables
     *
     * If you want to interact with the program's window, just use pWindow!
     */

	function handInfosToWindow() {
		let frameIsAccessible = false;
		myWindow.frame.data = {
			'mypid': myPid,
		};

		try {
			myWindow.frame.contentWindow.pid = myPid;
			myWindow.frame.contentWindow.os = myWindow.frame.contentWindow.mainos = window;
			myWindow.frame.contentWindow.document.documentElement.style.setProperty("--font", system.user.settings.font.fonts);
			myWindow.frame.contentWindow.isAccessibleFromParentFrame = true;
			frameIsAccessible = true;
		} catch(e) {}

		function stylesConstructor() {
			return {
				"left": 0,
				"top": 0,
				"width": 0,
				"height": 0,
				"opacity": 1
			}
		}

		var protectedData = {
			"pid": myPid,
			"attributes": iattr,
			"programObject": myProgram,
			"path": {
				"folderOfExecutable": myProgram.src.split("/").slice(0, -1).join("/"),
				"executable": myProgram.src,
				"folder": system.paths.programs + myProgram.id + "/",
				"data": system.user.paths.appdata + myProgram.id + "/",
				"logs": system.user.paths.logs + myProgram.id + "/",
				"temp": system.user.paths.temp + myProgram.id + "/"
			},
			"styles": stylesConstructor(),
			"interactionLock": false,
			"utils": {
				createAutoSavingStore(iofsRef, path, initial = {}) {
					let store = initial;

					const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

					const save = () => {
						try {
							iofsRef.save(path, JSON.stringify(store), "", 1);
						} catch (e) {
							console.error("AutoSavingStore save failed", e);
						}
					};

					const proxyCache = new WeakMap();

					const handler = {
						get(target, prop, receiver) {
							if (prop === 'toJSON') {
								return () => deepClone(store);
							}
							if (prop === 'getAll') {
								return () => deepClone(store);
							}
							if (prop === 'valueOf') {
								return () => store;
							}
							if (prop === Symbol.toPrimitive) {
								return (hint) => hint === 'string' ? JSON.stringify(store) : store;
							}

							const value = Reflect.get(target, prop, receiver);
							if (typeof value === "object" && value !== null) {
								const existing = proxyCache.get(value);
								if (existing) return existing;
								const nestedProxy = new Proxy(value, handler);
								proxyCache.set(value, nestedProxy);
								return nestedProxy;
							}
							return value;
						},
						set(target, prop, value, receiver) {
							const ok = Reflect.set(target, prop, value, receiver);
							save();
							return ok;
						},
						deleteProperty(target, prop) {
							const ok = Reflect.deleteProperty(target, prop);
							save();
							return ok;
						},
						ownKeys(target) {
							return Reflect.ownKeys(target);
						},
						getOwnPropertyDescriptor(target, prop) {
							return Reflect.getOwnPropertyDescriptor(target, prop);
						},
						has(target, prop) {
							return Reflect.has(target, prop);
						},
						defineProperty(target, prop, descriptor) {
							const ok = Reflect.defineProperty(target, prop, descriptor);
							save();
							return ok;
						}
					};

					return new Proxy(store, handler);
				}
			}
		};

		if(iattr && typeof iattr == "object") {
			if(iattr?.top) {
				protectedData.styles.top = iattr.top;
				myWindow.style.top = iattr.top;
			}
			if(iattr?.left) {
				protectedData.styles.left = iattr.left;
				myWindow.style.left = iattr.left;
			}
			if(iattr?.width) {
				protectedData.styles.width = iattr.width;
				myWindow.style.width = iattr.width;
			}
			if(iattr?.height) {
				protectedData.styles.height = iattr.height;
				myWindow.style.height = iattr.height;
			}
		}

		myWindow.pWindow = {
			"os": window,
			"mainos": window,
			"getWindow": function() {
				return myWindow;
			},
			"close": function(force = false) {
				unrun(myWindow, force);
			},
			"setMinimized": function(state) {
				// state = true or false, else it will toggle
				setWindowMinimized(myWindow, state);
			},
			"setMaximized": function(state) {
				// state = true or false, else it will toggle
				setWindowMaximized(myWindow, state);
			},
			"setFullscreen": function(state) {
				// state = true or false, else it will toggle
				setWindowFullscreen(myWindow, state);
			},
			"setAlwaysOnTop": function(state) {
				// state = true or false, else it will toggle
				setWindowAlwaysOnTop(myWindow, state);
			},
			"focus": function() {
				focusWindow(myWindow);
			},
			"setOpacity": function(opacity) {
				setWindowOpacity(myWindow, opacity);
			},
			"getPid": function() {
				return protectedData.pid;
			},
			"getAttributes": function() {
				return protectedData.attributes;
			},
			"getProgramObject": function() {
				return protectedData.programObject;
			},
			"getPath": function(which) {
				return protectedData.path[which];
			},
			"getPathList": function() {
				return JSON.parse(JSON.stringify(protectedData.path));
			},
			"getStyles": function() {
				return JSON.parse(JSON.stringify(protectedData.styles));
			},
			"getStyleProperty": function(property) {
				return protectedData.styles[property.toLowerCase().trim()] || undefined;
			},
			"setStyleProperty": function(property, value) {}, // Will be defined later since we rely on our object's functions
			"settings": {
				...(protectedData.programObject["settings"] || {}),
				...system.user.settings.programs[protectedData.programObject.id]
			},
			get variableStore() {
				if (!this.__variableStoreProxy) {
					const variableStorePath = myWindow.pWindow.getPathList().data + "variableStore.json";
					let initial = {};
					if (iofs.exists(variableStorePath)) {
						try {
							initial = JSON.parse(iofs.load(variableStorePath, true) || "{}");
						} catch (e) {
							initial = {};
						}
					} else {
						iofs.save(variableStorePath, JSON.stringify(initial), "", 1);
					}
					this.__variableStoreProxy = protectedData.utils.createAutoSavingStore(iofs, variableStorePath, initial);
				}
				return this.__variableStoreProxy;
			},
			set variableStore(value) {
				const variableStorePath = myWindow.pWindow.getPathList().data + "variableStore.json";
				this.__variableStoreProxy = protectedData.utils.createAutoSavingStore(iofs, variableStorePath, value || {});
				iofs.save(variableStorePath, JSON.stringify(value || {}), "", 1);
			},
			pushSettings: function() {
				system.user.settings.programs[protectedData.programObject.id] = this.settings;
				this.os.saveSystemVariable();
			},
			pullSettings: function() {
				this.settings = system.user.settings.programs[protectedData.programObject.id] || protectedData.programObject["settings"] || {};
			},
			get title() {
				return myWindow.getElementsByClassName("progtitle")[0].innerText;
			},
			set title(value) {
				if(!value) {
					value = protectedData.programObject.title;
				}

				myWindow.getElementsByClassName("progtitle")[0].innerText = value;

				try {
					myWindow.frame.contentWindow.document.title = value;
				} catch(e) {}

				tasklist.refreshItem(myWindow.id);
			},

			get icon() {
				return myWindow.getElementsByClassName("progicon")[0].src;
			},
			set icon(value) {
				if(!value) {
					value = protectedData.programObject.icon;
				}
				myWindow.getElementsByClassName("progicon")[0].src = value;
				try {
					myWindow.frame.contentWindow.document.querySelectorAll("link[rel~='icon']").forEach(el => el.setAttribute("href", value));
				} catch(e) {}

				tasklist.refreshItem(myWindow.id);
			},

			get interactionLock() {
				return protectedData.interactionLock;
			},
			set interactionLock(value) {
				if(value == false) {
					protectedData.interactionLock = false;
					myWindow.removeAttribute("interactionlocked");
					myWindow.frame.removeAttribute("inert");
					myWindow.querySelector(".controls").removeAttribute("inert");
				} else {
					protectedData.interactionLock = value;
					myWindow.frame.setAttribute("inert", "inert");
					if(getWindowByMagic(value)) {
						myWindow.setAttribute("interactionlocked", getWindowByMagic(value).id);
						myWindow.querySelector(".controls").setAttribute("inert", "inert");
						getWindowByMagic(value).frame.focus();
					}
				}
				tasklist.refreshItem(myWindow.id);
			}
		}

		myWindow.pWindow.setStyleProperty = function(property, value) {
			protectedData.styles[property] = value;
			let propertySanitized = property.toLowerCase().trim();
			let myStyles = this.getStyles();
			switch(propertySanitized) {
				case "opacity":
					this.setOpacity(value);
					break;
				case "left":
				case "right":
				case "top":
				case "bottom":
				case "width":
				case "height":
				default:
					parent.resizeWindow(myWindow, myStyles.width, myStyles.height);
					parent.dragWindow(myWindow, myStyles.left, myStyles.top, myWindow.offsetLeft, myWindow.offsetTop);
					break;
			}
		}

		if(frameIsAccessible) {
			myWindow.frame.pWindow = myWindow.frame.contentWindow.pWindow = myWindow.pWindow;
		}

		// send message to program when pWindow is ready
		myWindow.frame.contentWindow.postMessage('pWindowReady', (new URL(myWindow.frame.src).origin));

		// Sorry pals, but it's important to know which program is used how often.
		setTimeout(() => {
			if(_paq) {
				_paq.push(['trackEvent', "Program", myProgram.title, "open", system.runtime.pidmax]);
			}
		}, 0);
	}

	// once the frame's src is fully loaded, we hand infos to the window
	myWindow.frame.addEventListener("load", function() {
		handInfosToWindow();
	}, {"once": true});

	if(!myWindow?.classList?.contains("minimized")) {
		focusWindow(getWindowById(myWindow.id));
	}


	function checkMayStillOpen(programIdentifier) {
		let myProgram = system.user.programs[programIdentifier];
		if(!myProgram.maxopen) {
			return true; // No limit
		}
		let stillOpenable = myProgram.maxopen + 1;
	
		for(let processListEntry of getProcessList(false)) {
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

	requestIdleCallback(() => {
		getProcessList(true).forEach(proc => {
			if(proc?.programObject?.getNotifiedByEvents?.includes("processListChanged")) {
				proc.window?.frame?.contentWindow?.postMessage({
					"type": "eventNotification",
					"event": "processListChanged",
					"eventSub": "programStarted",
					"pid": myPid
				});
			}
		});
	});

	return myWindow;
}

/**
 * changes the opacity of the window
 * @param {HTMLElement} which the window to change the opacity of
 * @param {number} opacity the opacity to set
 */
function setWindowOpacity(which, opacity) {
    if(!opacity) {
        opacity = "";
    }
    which.pWindow.opacity = opacity;
    which.style.opacity = opacity;
}

/**
 * focusses a window
 * @param which which window to focus (false to unfocus all)
 * @param {boolean} state if false, will unfocus all windows and return
 */
function focusWindow(which, state) {
    if(state == false || which == false) {
        unfocus();
        return;
    }

    systemRuntime.zindex++;
    which.style.zIndex = systemRuntime.zindex;
    which.children[2].focus();


    if(which.classList.contains("minimized")) {
        setWindowMinimized(which, false);
    }

    unfocus();

    which.classList.add("active");


	if(which.getAttribute("interactionlocked")) {
		getWindowById(which.getAttribute("interactionlocked"))?.pWindow?.focus();
	}

    tasklist.focusItem(which);

    /**
     * unfocuses all windows
    */

    function unfocus() {
        // unfocus window
        for(let myWindow of document.getElementsByClassName("program")) {
            if(myWindow.classList.contains("active")) {
                myWindow.classList.remove("active");
            }
        }

        // unfocus taskbar entry
        tasklist.unfocusAll();
    }
}

function setWindowAlwaysOnTop(which, state) {
    if(state == true) {
        which.classList.add("alwaysontop");
    } else if(state == false) {
        which.classList.remove("alwaysontop");
    } else {
        setWindowAlwaysOnTop(which, !which.classList.contains("alwaysontop"));
        return;
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
	// If is number without unit, assume px
	if(x && isFinite(x)) {
		x = offsetX - x + "px";
	}

	// If is number without unit, assume px
	if(y && isFinite(y)) {
		y = offsetY - y + "px";
	}

	// Only set if is defined
	if(x) {
		which.style.left = x;
	}

	// Only set if is defined
	if(y) {
		which.style.top = y;
	}

	if((which.pWindow.getStyleProperty("left") && x) && which.pWindow.getStyleProperty("left") != x) {
		which.pWindow.setStyleProperty("left", x);
	}

	if((which.pWindow.getStyleProperty("top") && y) && which.pWindow.getStyleProperty("top") != y) {
		which.pWindow.setStyleProperty("top", y);
	}
}

/**
 * Resizes a window
 * @param which which window
 * @param {number} width 
 * @param {number} height 
 */
function resizeWindow(which, width, height) {
	// If is number without unit, assume px
	if(width && isFinite(width)) {
		width = width + "px";
	}
	// If is number without unit, assume px
	if(height && isFinite(height)) {
		height = height + "px";
	}

	// Only set if is defined
	if(height) {
		which.style.height = height;
	}

	// Only set if is defined
	if(width) {
		which.style.width = width;
	}

	if((which.pWindow.getStyleProperty("width") && width) && which.pWindow.getStyleProperty("width") != width) {
		which.pWindow.setStyleProperty("width", width);
	}

	if((which.pWindow.getStyleProperty("height") && height) && which.pWindow.getStyleProperty("height") != height) {
		which.pWindow.setStyleProperty("height", height);
	}
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
function unrun(which, force = false) { // Unrun / close a program
	const myPid = +which?.id;
	const processListChangedMessage = {
		"type": "eventNotification",
		"event": "processListChanged",
		"eventSub": "programStopRequested",
		"forced": force,
		"pid": myPid
	};

	requestIdleCallback(() => {
		getProcessList(true).forEach(proc => {
			if(proc?.programObject?.getNotifiedByEvents?.includes("processListChanged")) {
				proc.window?.frame?.contentWindow?.postMessage(processListChangedMessage);
			}
		});
	});

	if(which?.pWindow?.onBeforeUnrun && !force) {
		if(which.pWindow.onBeforeUnrun() === false) {
			return false;
		}
	}

	which.classList.add("closing");

	if(which.classList.contains("minimized")) {
		unrun_killProgram();
	} else {
		which.addEventListener("transitionend", function handleTransitionEnd(e) {
			if (e.target.classList.contains("program") && e.propertyName == "transform") {
				window.setTimeout(function() {
					unrun_killProgram();
				}, (system?.user?.settings?.processManagement?.windowCloseTimeout ?? 1000) / 100);

				which.removeEventListener("transitionend", handleTransitionEnd);
			}
		});

		window.setTimeout(function() {
			if(system.runtime.processList[+which.id]) {
				unrun_killProgram();
			}
		}, system?.user?.settings?.processManagement?.windowCloseTimeout ?? 2000);
	}

	function unrun_killProgram() {
		which.children[2].src = "about:blank";
		which.outerHTML = "";
		system.runtime.processList[+which.id] = null;
		tasklist.removeItem(which);

		requestIdleCallback(() => {
			getProcessList(true).forEach(proc => {
				if(proc?.programObject?.getNotifiedByEvents?.includes("processListChanged")) {
					proc.window?.frame?.contentWindow?.postMessage({
						...processListChangedMessage,
						"eventSub": "programClosed"
					});
				}
			});
		});
	}
}

/**
 * Maximizes or windowes a window
 * @param which window
 * @param {boolean} state maximize or unmaximize
 */

function setWindowMaximized(which, state) {
    which.style.transition = ".3s";

    if(state == true) {
        which.classList.add("maximized");
        which.classList.remove("notmaximized");
        which.style.top = "0";
        which.style.left = "0";
        which.style.height = "";
        which.style.width = "";
    } else if(state == false) {
        which.classList.remove("maximized");
        which.classList.add("notmaximized");
        which.style.top = "15%";
        which.style.left = "15%";
        which.style.height = "";
        which.style.width = "";
    } else {
        setWindowMaximized(which, !which.classList.contains("maximized"));
        return;
    }


    systemRuntime.clicking = 0;
    systemRuntime.clicked = 1;

    // if minimized, unminimize

    if(which.classList.contains("minimized")) {
        setWindowMinimized(which, false);
    }

    setTimeout(function() {
        which.style.transition = "";
    }, 300);
}


/**
 * Fullscreens or unfullscreens a window
 * @param which window
 * @param {boolean} state fullscreen / unfullscreen (default: auto)
 */
function setWindowFullscreen(which, state) {
    which.style.transition = ".5s";
    if(state == true) {
        which.classList.add("fullscreen");
    } else if(state == false) {
        which.classList.remove("fullscreen");
    } else {
        setWindowFullscreen(which, !which.classList.contains("fullscreen"));
        return;
    }
    window.setTimeout(function() {
        which.style.transition = "";
    },500);
}

/**
 * Minimizes or unminimizes a window
 * @param which window
 * @param {boolean} state minimize / unminimize (default: auto)
 */
function setWindowMinimized(which, state) {
	which.style.transition = "0s";
	which.classList.remove("peeking");
	which.style.removeProperty("transition");
	which.classList.add("minimizing");

	if(state == true) {
		which.classList.add("minimized");
		which.getElementsByTagName("iframe")[0].setAttribute("disabled", true);
		focusWindow(false);
	} else if(state == false) {
		which.getElementsByTagName("iframe")[0].removeAttribute("disabled");
		which.classList.remove("minimized");
	} else {
		setWindowMinimized(which, !which.classList.contains("minimized"));
		return;
	}

	if(which.getAnimations().length > 0) {
		which.addEventListener("transitionend", function handleTransitionEnd(e) {
			if (e.target.classList.contains("program")) {
				which.classList.remove("minimizing");
				which.removeEventListener("transitionend", handleTransitionEnd);
			}
		});
	} else {
		which.classList.remove("minimizing");
	}
}

/**
 * Minimizes all windows
 */
function showDesktop(state = "toggle") {
    if(state == "toggle") {
        for(let i = 0; i < pid.length; i++) {
            if(pid[i] != "" && pid[i] != undefined) {
                setWindowMinimized(getWindowById(i), true);
            }
        }
    } else if(state == "peek") {
        document.getElementsByClassName("programs")[0].classList.add("peek");
    } else if(state == "unpeek") {
        document.getElementsByClassName("programs")[0].classList.remove("peek");
    }
}



/**
 * Returns a window by id
 * @param {number} id
 * @returns {object} window
 */
function getWindowById(id) {
    return document.getElementById(id);
}

function getWindowByPid(pid) {
    return getWindowById(pid);
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
        result = getWindowByPid(which);
    }
    if(result == undefined || result == null || result == "") {
        result = getWindowByChildElement(which);
    }
    if(result == undefined || result == null || result == "") {
        if(which.pWindow) {
            result = which.pWindow.getWindow();
        }
    }
    return result;
}

function getProgramByMagic(which) {
    return system.user.programs[pid[getWindowByMagic(which).id]].id;
}

function peekProgram(which, state) {
	if(state == true) {
		which.classList.add("peeking");
	} else if(state == false) {
		which.classList.remove("peeking");
	} else {
		peekProgram(which, !which.classList.contains("peek"));
	}
}
