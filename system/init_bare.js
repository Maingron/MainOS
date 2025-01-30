"use strict";

export const initBare = {
	// private variable, only allow running once
	ran: false,
	initBare: function() {
		if(this.ran) {
			throw new Error("initBare can only be run once");
			return false;
		}

		window.objects = {};
		window.register = [];
		window.program = {};
		window.processList = window.pid = [];
		window.objs = null;
		window.result = null;
		window.iattr = null;
		window.attr = null;
		window.setting = {};
		window.system = {
			runtime: {
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
				"documentRoot": location.pathname,
				"documentHost": document.getElementById("documentRoot").href,

				"time": function() {
					// TODO: Add potential offset
					var result = new Date();
			
					var toDoubleDigit = function(which) {
						while (which.toString().length <= 1) {
							which = "0" + which;
						}
						return which;
					}
			
					result.whatTime = function() {
						return toDoubleDigit(this.getHours()) + ":" + toDoubleDigit(this.getMinutes());
					}
			
					result.whatTimeAndSeconds = function() {
						return this.whatTime() + ":" + toDoubleDigit(this.getSeconds());
					}
			
					result.whatDate = function() {
						return this.getFullYear() + "-" + toDoubleDigit(this.getMonth() + 1) + "-" + toDoubleDigit(this.getDate());
					}
			
					return result;
				},
				
				systemFunctions: {
					shutdown: function() {
						// TODO: Add check so it can't be run by every program
						window.close();
						self.close();
					},
					reboot: function() {
						window.location.reload();
					}
				}
			}
		};

		window.systemRuntime = window.system.runtime;

		window.mainos = {};
	}
}
