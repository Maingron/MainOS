export function version(versionString = 0) {
	// https://semver.org/

	let major, minor, patch, build;

	let toString = function() {
		let outputString = `${major}.${minor}.${patch}`;
		if(build) {
			outputString += `-${build}`;
		}
		return outputString;
	}

	const returnObj = {
		toString: toString,
		isNewerThan: function(right, verbose = false) {
			if(!right) {
				throw new Error("Expected a version to compare to.");
			}
			return isNewerThan(this, right, verbose);
		},
		get major() {
			return major;
		},
		set major(value) {
			major = (("" + value).replace(/\D/g, '') || 0);
		},
		get minor() {
			return minor;
		},
		set minor(value) {
			minor = (("" + value).replace(/\D/g, '') || 0);
		},
		get patch() {
			return patch;
		},
		set patch(value) {
			patch = (("" + value).replace(/\D/g, '') || 0);
		},
		get build() {
			return build;
		},
		set build(value) {
			build = value || undefined;
		},
		get version() {
			return toString();
		},
		set version(value) {
			if(typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'object') {
				throw new Error("Got incompatible version format (expected string, number or version object).");
			}

			if(typeof value == 'object' && value.toString) {
				value = value.toString();
			}

			value = ("" + value).split('.');
			this.major = value.shift() || 0;
			this.minor = value.shift() || 0;
			value = value.join('.').split('-');
			this.patch = value.shift() || 0;
			this.build = value.join('-') || undefined;
		}
	};

	returnObj.version = versionString;

	return returnObj;
}

export function isNewerThan(left, right, verbose = false) {
	let reason;
	let isNewer = false;

	if(!left || !right) {
		throw new Error("Expected two versions.");
	}

	left = version(left);
	right = version(right);

	for(let key of ["major", "minor", "patch", "build"]) {
		if(left[key] == right[key]) {
			continue;
		} else if(left[key] > right[key]) {
			isNewer = true;
			reason = key;
			break;
		} else if(left[key] < right[key]) {
			isNewer = false;
			reason = key;
			break;
		}
	}

	if(left.toString() == right.toString()) {
		isNewer = false;
		reason = "equal";
	}

	if(verbose) {
		return {
			isNewer: isNewer,
			reason: reason
		}
	}

	return isNewer;
}
