// Do not use functions of this file yet - still wip / poc.
// TODO: Use promises
// TODO: use single object (new programInstallerTask) {installProgam, uninstallProgram, updateProgram}

function install_program(programDir) {
	programDir = iofs.sanitizePath(programDir);
	let installerJsonPath = iofs.sanitizePath(programDir + "/installer.json");

	loadInstallProgramJson(installerJsonPath, function(json) {
		handleInstallerJson(programDir, json);
	});
}

function loadInstallProgramJson(path, callback) {
	iofs.loadExternal(path, function(response) {
		try {
			response = JSON.parse(response);
		} catch(e) {
			throw new Error("Response isn't valid JSON. Aborting");
		}
		callback(response);
	});
}

function handleInstallerJson(programDir, json) {
	if(typeof json !== "object") {
		try {
			json = JSON.parse(json);
		} catch(e) {
			throw new Error("Invalid JSON");
		}
	}

	let myPaths = {
		programFiles: system.paths.programs + json.meta.id + "/"
	};

	if(!iofs.exists(myPaths.programFiles)) {
		iofs.save(myPaths.programFiles, null, "t=d");
	}

	let externalFilesLoaded = [];

	// copy files to iofs
	for(let file of json.copyFiles.programs) {
		iofs.loadExternal(programDir + file, function(content) {
			iofs.save(myPaths.programFiles + file, content);
		});
	}

	// extract meta from installer.json and save as meta.json
	iofs.save(myPaths.programFiles + "meta.json", JSON.stringify(json.meta));

	let allProgramJson = iofs.load("C:/system/installed_programs.json");
	allProgramJson = JSON.parse(allProgramJson);
	allProgramJson[json.meta.id] = json.meta;
	console.log(allProgramJson);
	iofs.save("C:/system/installed_programs.json", JSON.stringify(allProgramJson), undefined, true);

	system.users[0].paths[json.meta.id] = json.meta;
	system.user.programs[json.meta.id] = json.meta;
	loadProgramMetadata(json.meta.id);
}
