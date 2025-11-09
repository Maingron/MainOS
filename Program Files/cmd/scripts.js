var objects = {
	content: document.getElementsByClassName("content")[0],
	cmdinput: document.getElementsByClassName("cmdinput")[0],
	cmdoutput: document.getElementsByClassName("cmdoutput")[0]
};

var cls = 0;
var historyFile;

window.addEventListener("keydown", function (e) {
	if (e.keyCode == 13) { // Enter
		cmdsubmit();
		updateTerminal();
	}
});

function updateTerminal() {
	objects.cmdoutput.innerHTML = iofs.load(historyFile);
	iofs.save(historyFile, "", "t=txt", 1);

	window.scrollTo(0, document.body.scrollHeight);

	objects.cmdinput.value = "";
	objects.cmdinput.focus();
	objects.cmdinput.select();
}

function cmdsubmit() {
	var response = runcmd("cmd:" + objects.cmdinput.value);

	if (response == "") {
		if (cls == 1) {
			iofs.save(historyFile, objects.cmdoutput.innerHTML + escapeHtml(objects.cmdinput.value), "t=txt", 1);
			cls = 0;
		} else {
			iofs.save(historyFile, objects.cmdoutput.innerHTML + "> " + escapeHtml(objects.cmdinput.value) + "<br>", "t=txt", 1);
		}
	} else {
		iofs.save(historyFile, objects.cmdoutput.innerHTML + "> " + escapeHtml(objects.cmdinput.value) + "<br>" + response + "<br>", "t=txt", 1);
	}

	objects.cmdoutput.innerHTML = iofs.load(historyFile);
}

function runcmd(which) {

	if (which.indexOf("md:") != 1) {
		return "error";
	}

	if (which.indexOf("echo") == 4) {
		return (which.split("cmd:echo")[1]);
	}

	if (which.indexOf("run") == 4) {
		window.parent.run(which.split("cmd:run ")[1]);
		return "";
	}

	if (which.indexOf("close") == 4) {
		// if pid is invalid return error
		if (!parent.pid[which.split("cmd:close ")[1]]) {
			return "Error: Invalid PID";
		}
		parent.unrun(parent.getWindowByMagic(which.split("cmd:close ")[1]));
		return "";
	}

	if (which.indexOf("pids") == 4) {
		var result = "";
		for (j = 0; parent.pid.length > j; j++) {
			if (parent.pid[j] && parent.pid[j].length > 0) {
				result = result + "<br>" + j + "=" + parent.pid[j];
			}
		}
		return result;
	}

	if (which.indexOf("mkdir") == 4) {
		if (iofs.exists(which.split("cmd:mkdir")[1])) {
			return "Error: Folder already exists";
		} else {
			iofs.save(which.split("cmd:mkdir")[1], "", "t=dir", 0);
			return "Created folder";
		}
	}

	if (which.indexOf("cls") == 4 || which.indexOf("clear") == 4) {
		cls = 1;
		objects.cmdoutput.innerHTML = "";
		objects.cmdinput.value = "";
		iofs.save(historyFile, "", "t=txt", 1);
		updateTerminal();
		return "";
	}

	if (which.indexOf("ls") == 4 || which.indexOf("dir") == 4) {
		if(which.indexOf("dir") == 4) {
			which = which.replace("cmd:dir ", "cmd:ls ");
		}
		var path = which.split("cmd:ls ")[1] || system.user.paths.userPath;
		var files = iofs.listdir(path);
		var result = "";
		for (var i = 0; i < files.length; i++) {
			result = result + files[i] + "<br>";
		}
		return result;
	}

	if (which.indexOf("setting") == 4) {
		which = which.split("cmd:setting ")[1];
		which = which.toLowerCase();
		// if setting is a file
		if (iofs.exists(system.user.paths.userPath + "settings/" + which.split(" ")[0] + ".txt")) {
			// if doesnt define value, return value
			if (!which.split(" ")[1]) {
				return ("(Ancient variable, use settings menu) <br>" + which + ": " + iofs.load(system.user.paths.userPath + "settings/" + which.split(" ")[0] + ".txt"));
			} else {
				iofs.save(system.user.paths.userPath + "settings/" + which.split(" ")[0] + ".txt", which.split(" ")[1], "t=txt", 1);
				window.parent.loadsettings();
				return "'(Ancient variable, use settings menu) <br>' + changed setting - a reload may be required";
			}
		} else {
			return "'(Ancient variable, use settings menu) <br>' + Error: Setting not found";
		}
	}

	if( which.indexOf("pwd") == 4) {
		return "Sometimes " + system.user.paths.userPath + ", other times /";
	}

	if (which.indexOf("restart") == 4) {
		window.parent.location.reload();
		cls = 1;
		objects.cmdoutput.innerHTML = "";
		objects.cmdinput.value = "";
		return "";
	}

	if (which.indexOf("version") == 4) {
		return (`${system.osDetails.name} Version: ${system.osDetails.version}`);
	}

	if (which.indexOf("help") == 4) {
		return /*html*/ `
		<b class='helpb' style='font-weight:inherit'><b>cls</b> clears console<br>
		<b>echo <a>[Message]</a></b> well, it's echo...<br>
		<b>run <b>[name of program]</b></b> opens a program<br>
		<b>close <b>[pid of program]</b></b> closes a program<br>
		<b>pids </b> lists currently running programs<br><b>exit</b> closes the terminal<br>
		<b>setting <b> [Name of setting] [value]</b></b> changes a setting | <b style="color:#f55">deprecated, use settings app</b><br>
		<b>restart</b> restarts ${system.osDetails.name}<br>
		<b>mkdir <a>[Path]</a></b> Create a directory<br>
		<b>ls <a>[Path]</a></b> List directory contents<br>
		<b>pwd</b> Show working directory<br>
		<b>version</b> Shows ${system.osDetails.name} Version<br>
		</b>
		<p style='display:block;line-height:18px'>&nbsp;</p>
		<b class='helpb'>devmode commands:<br><b>js <b>js</b></b> executes js<br>`;
	}

	if (which.indexOf("toggledownfall") == 4) {
		return "<b style='color:#f55; font-weight:inherit'>Command not found. Try /mc:help to get help.</b>";
	}

	if (which.indexOf("exit") == 4) {
		objects.cmdoutput.innerHTML = "";
		objects.cmdinput.value = "";
		iofs.save(historyFile, "", "t=txt", 1);
		pWindow.close();
	}

	if (which.indexOf("js ") == 4) {
		if (window.parent.setting.developer = 1) {
			iofs.save(historyFile, "", "t=txt", 1);
			if (which.indexOf("js ") == 4) {
				eval(which.split("cmd:js ")[1]);
				return "Ran JS Command";
			}
		} else {
			return "You have to activate the developer mode to enable js commands. Be careful though!";
		}
	}
	return "Command not defined";
}

function escapeHtml(which) {
	while (which.indexOf("<") > 4) {
		which = which.replace("<", "&lt;");
	}
	return (which);
}

window.addEventListener('message', function (event) {
	if (event.data === 'pWindowReady') {
		historyFile = pWindow.getPath("temp") + "cmdhistory.dat";

		// create temp folder in pWindow.getPath("data") if it doesn't exist
		iofs.save(pWindow.getPath("temp"), "", "t=dir", 0);

		// create cmdhistory.dat if it doesn't exist
		if (!iofs.exists(historyFile)) {
			iofs.save(historyFile, "", "t=txt", 1);
		}

		objects.cmdinput.focus();
	}
});
