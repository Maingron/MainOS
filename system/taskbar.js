// Task List
export const tasklist = {
    "htmlElement": document.getElementById("tasklist"),

    "addItem": function(myWindow, myProgram) {
        if(myProgram == undefined || myProgram == "" || myProgram.spawnicon == 0) {
            return;
        }

        var newItemElement = document.createElement("button");
        newItemElement.innerHTML = `
            <img src="${myProgram.icon}" alt="">
            <span>${myProgram.title}</span>
        `;
        newItemElement.classList.add("has_hover");
        newItemElement.title = myProgram.title;
        newItemElement.setAttribute("pid", myWindow.getAttribute("pid"));

		newItemElement.addEventListener("click", function() {
			let which = this;
			let myProgramWindow = getWindowByMagic(which.getAttribute("pid"));

			myProgramWindow.style.transition = "0s";

			peekProgram(myProgramWindow, false);
			window.setTimeout(function() {
				myProgramWindow.style.removeProperty("transition");

				if(which.classList.contains("active")) {
					setWindowMinimized(getWindowByMagic(which.getAttribute("pid")));
				} else {
					setWindowMinimized(getWindowByMagic(which.getAttribute("pid")), false);
					focusWindow(getWindowByMagic(which.getAttribute("pid")));
				}
			}, 10);

		});

        newItemElement.addEventListener("mouseover", function() {
            // peek
            peekProgram(getWindowByMagic(this.getAttribute("pid")), true);
        });

        newItemElement.addEventListener("mouseout", function() {
            // unpeek
			let which = this;
			let myProgramWindow = getWindowByMagic(which.getAttribute("pid"));
			myProgramWindow.style.transition = "0s";
			peekProgram(myProgramWindow, false);
			window.setTimeout(function() {
				myProgramWindow.style.removeProperty("transition");
			}, 10);
        });

        // clone process with middle click
        newItemElement.addEventListener("auxclick", function(event) {
            if(event.which == 2) {
                run(system.user.programs[pid[this.getAttribute("pid")]].id);
            }
        });

        tasklist.htmlElement.appendChild(newItemElement);
    },

    "removeItem": function(which) {
        let itemElement = tasklist.htmlElement.querySelector(`[pid="${which.id}"]`);
        // make sure the child exists
        if(!itemElement) {
            return;
        }
        tasklist.htmlElement.removeChild(itemElement);
    },

    "focusItem": function(which) {
        let itemElement = tasklist.htmlElement.querySelector(`[pid="${which.id}"]`);
        // make sure the child exists
        if(!itemElement) {
            return;
        }
        itemElement.classList.add("active");
    },

    "unfocusAll": function() {
        tasklist.htmlElement.querySelectorAll(".active").forEach((item) => {
            item.classList.remove("active");
        });
    }
}

// new taskbar taskbar

export const Taskbar = function() {
	this.htmlElement = document.getElementById("taskbar");
	this.tasklist = document.getElementById("tasklist");

	this.lang = {
		htmlElement: document.getElementsByClassName("taskbarlanguage")[0],
		update: function() {
			this.htmlElement.innerHTML = system.user.settings.language;
		}
	}

	this.clock = {
		htmlElement: document.getElementById("taskbartime"),
		interval: null
	}

	this.showDesktopButton = {
		htmlElement: this.htmlElement.getElementsByClassName("show-desktop")[0],
		update: function() {
			this.htmlElement.style.width = system.user.settings.taskbar.showShowDesktopWidth + "px";
		}
	}

	this.onlineStatus = {
		wasOnline: system?.runtime?.isOnline ?? false,
		htmlElement: this.htmlElement.getElementsByClassName("taskbaronlinestatus")[0],
		htmlElementImg: (() => {
			let img = this.htmlElement.querySelector(".taskbaronlinestatus img");
			if (!img) {
				img = document.createElement("img");
				img.className = "icon";
				img.title = "Online Status";
				img.src = "img/transparent.png";
				this.htmlElement.querySelector(".taskbaronlinestatus").appendChild(img);
			}
			return img;
		})(),
		update: function() {
			if(this.wasOnline == system?.runtime?.isOnline) {
				return; // no change
			}
			this.wasOnline = system?.runtime?.isOnline;
			if(system?.runtime?.isOnline) {
				this.htmlElementImg.title = "Online";
				if(system.user.settings.prefersDarkMode) {
					this.htmlElementImg.src = iofs.load(system.paths.icons.system + "wifi-dark.svg", false);
				} else {
					this.htmlElementImg.src = iofs.load(system.paths.icons.system + "wifi.svg", false);
				}
			} else {
				this.htmlElementImg.title = "Offline";
				if(system.user.settings.prefersDarkMode) {
					this.htmlElementImg.src = iofs.load(system.paths.icons.system + "wifi strike-dark.svg", false);
				} else {
					this.htmlElementImg.src = iofs.load(system.paths.icons.system + "wifi strike.svg", false);
				}
			}
		},
		interval: null
	}

	this.batteryStatus = {
		instance: null,
		init: async function() {
			console.log('Initializing battery status from taskbar...');
			try {
				// Import battery status module
				const module = await import('./modules/battery-status.js');
				console.log('Battery module imported successfully');
				
				this.instance = new module.BatteryStatus();
				console.log('Battery instance created');
				
				// Initialize battery status
				const success = await this.instance.init();
				if (!success) {
					console.log('Battery status not available or not supported');
					this.instance = null;
				} else {
					console.log('Battery status initialized successfully from taskbar');
				}
			} catch (error) {
				console.error('Failed to load battery status module:', error);
				this.instance = null;
			}
		},
		update: function() {
			// Battery updates are handled by the battery module itself
			// This is here for consistency with other taskbar components
			if (this.instance) {
				this.instance.updateBatteryIcon();
			}
		},
		destroy: function() {
			if (this.instance) {
				this.instance.destroy();
				this.instance = null;
			}
		}
	}

	this.tasklist = tasklist;

	this.updateSettings = function(self) {
		deinit(self);

		// showClock
			if(system.user.settings.taskbar.showClock) {
				self.clock.interval = setInterval(function() {
					self.clock.htmlElement.innerHTML = systemRuntime.time().whatTime();
				}, 500);
				self.clock.htmlElement.classList.remove("hidden");
			} else {
				self.clock.htmlElement.classList.add("hidden");
			}

		// showLang
			if(system.user.settings.taskbar.showLang) {
				self.lang.htmlElement.classList.remove("hidden");
			} else {
				self.lang.htmlElement.classList.add("hidden");
			}

		// showShowDesktop
			self.showDesktopButton.update();
			if(system.user.settings.taskbar.showShowDesktop) {
				self.showDesktopButton.htmlElement.classList.remove("hidden");
			} else {
				self.showDesktopButton.htmlElement.classList.add("hidden");
			}

		// showProgramTitle
			if(system.user.settings.taskbar.showProgramTitle) {
				self.tasklist.htmlElement.classList.add("showprogramtitle");
			} else {
				self.tasklist.htmlElement.classList.remove("showprogramtitle");
			}

		// showOnlineStatus
			if(system.user.settings.taskbar.showOnlineStatus) {
				self.onlineStatus.update();
				self.onlineStatus.interval = setInterval(function() {
					self.onlineStatus.update();
				}, 2000);
				self.onlineStatus.htmlElement.classList.remove("hidden");
			} else {
				self.onlineStatus.htmlElement.classList.add("hidden");
			}

		// showBatteryStatus
			if(system.user.settings.taskbar.showBatteryStatus) {
				// Battery status is handled by its own module
				// We just ensure it's visible if the setting is enabled
				if(self.batteryStatus.instance) {
					self.batteryStatus.instance.show();
				}
			} else {
				// Hide battery status if setting is disabled
				if(self.batteryStatus.instance) {
					self.batteryStatus.instance.hide();
				}
			}

		// position
			self.htmlElement.setAttribute("position", system.user.settings.taskbar.position);
	}

		
	var init = function(self) {
		self.lang.update();
		self.updateSettings(self);
		
		// Initialize battery status
		self.batteryStatus.init();
	}

	var deinit = function(self) {
		clearInterval(self.clock.interval);
		clearInterval(self.onlineStatus.interval);
		
		// Cleanup battery status
		self.batteryStatus.destroy();
	}

	init(this);
}
