export function version(versionString = 0) {
	// https://semver.org/

	if(typeof versionString === 'number') {
		versionString = "" + versionString;
} else if(typeof versionString == 'object' && versionString.toString) {
		versionString = versionString.toString();
	} else if(typeof versionString !== 'string') {
		throw new Error("Got incompatible version format");
	}

	let version = versionString?.split('.');

	let major = version[0] || 0;
	let minor = version[1] || 0;
	let patch = version[2] || 0;
	let build = version[3] || undefined;

	// Assign patch if patch is given
	if(patch && patch?.includes("-")) {
		build = patch.split(patch.split("-")[0] + "-")[1];
		patch = patch.split("-")[0];
	}

	// Clean output
	if(major) {
		major = major.replace(/\D/g, '');
	}
	if(minor) {
		minor.replace(/\D/g, '');
	}
	if(patch) {
		patch.replace(/\D/g, '');
	}

	if(!build) {
		build = undefined;
	}

	let toString = function() {
		let outputString = `${major}.${minor}.${patch}`;
		if(build) {
			outputString += `.${build}`;
		}
		return outputString;
	}

	const returnObj = {
		major: +major,
		minor: +minor,
		patch: +patch,
		build: +build || build,
		toString: toString
	};

	Object.freeze(returnObj);

	return returnObj;
}
