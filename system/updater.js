export const updater = {
	checkIfIsInstalled: function() {
		if(iofs.exists("C:/system/system_variable.txt")) {
			return true;
		} else {
			return false;
		}
	},

	runFreshInstall: function() {
		let iofsv2_installos;

		import("./iofsv2-installos.js").then(module => {
			iofsv2_installos = module.iofsv2_installos;
			iofsv2_installos.runInstall();
		});

	}
}
