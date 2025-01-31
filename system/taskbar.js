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
                
            if(this.classList.contains("active")) {
                setWindowMinimized(getWindowByMagic(this.getAttribute("pid")));
            } else {
                setWindowMinimized(getWindowByMagic(this.getAttribute("pid")), false);
                focusWindow(getWindowByMagic(this.getAttribute("pid")));
            }
        });

        newItemElement.addEventListener("mouseover", function() {
            // peek
            peekProgram(getWindowByMagic(this.getAttribute("pid")), true);
        });

        newItemElement.addEventListener("mouseout", function() {
            // unpeek
            peekProgram(getWindowByMagic(this.getAttribute("pid")), false);
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
	}

	this.tasklist = tasklist;

	this.updateSettings = function(self) {
		// showClock
			if(self.clock.interval) {
				clearInterval(self.clock.interval);
			}
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

		// position
			self.htmlElement.setAttribute("position", system.user.settings.taskbar.position);
	}

		
	var init = function(self) {
		self.lang.update();
		self.updateSettings(self);
	}

	var deinit = function(self) {
		clearInterval(self.clock.interval);
	}

	init(this);
}
