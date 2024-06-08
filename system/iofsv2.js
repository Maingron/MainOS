var iofs = {
	forbiddenCharsInPath: ['*', '?', '#', '$', '\'', '"', '`', '\\', '§', ','],

	save: function(path, content, attributes = false, override = false, recursive = false) {
		path = this.sanitizePath(path);

		if(!this.isAllowedPath(path)) {
			return false;
		}

		if(!override && this.exists(path)) {
			return false;
		}

		if(attributes == false) {
			attributes = this.load(path, true) || "";
		}

		attributes = "" + attributes;

		if(attributes.indexOf("t=d") >= 0) {
			var isFolder = true;
		}

		// TODO: Add time / change time

		if(isFolder) {
			localStorage.setItem(path, "t=d");
		} else {
			localStorage.setItem(path, attributes + "*" + content);
		}

		return true;
	},

	load: function(path, attributesInstead = false) {
		if(!this.isAllowedPath(path)) {
			return null;
		}

		path = this.sanitizePath(path);

		if(!this.exists(path)) {
			return null;
		}

		var fullFileContent;

		if(this.typeof(path) == "dir") {
			fullFileContent = "t=d*" + JSON.stringify(this.listdir(path));
		} else {
			fullFileContent = localStorage.getItem(path);
		}

		var requestedContent = "";

		if(attributesInstead) {
			requestedContent = fullFileContent.split("*")[0];
		} else {
			requestedContent = fullFileContent.split("*")[1];
			
			if(this.typeof(path) == "dir") {
				requestedContent = JSON.parse(requestedContent);
			}
		}

		return requestedContent;
	},

	exists: function(path) {
		path = this.sanitizePath(path);

		if(localStorage.getItem(path) != null) {
			return true;
		}
		return false;
	},

	typeof: function(path) {
		path = this.sanitizePath(path);

		if(!this.exists(path)) {
			return null;
		}

		if(localStorage.getItem(path).split("*")[0].indexOf("t=d") >= 0) {
			return "dir";
		} else {
			return "file";
		}
		
	},

	getName: function(path) {
		path = this.sanitizePath(path);

		pathArray = path.split("/");

		return pathArray[pathArray.length - 1];
	},

	getPath: function(path) {
		path = this.sanitizePath(path);
		var goUpCount = 0;

		let pathArray = path.split("/");

		if(pathArray.includes("..")) {
			for(let item of pathArray) {
				if(item == "..") {
					goUpCount += 2;
				}
			}
			goUpCount -= 1;
		}

		pathArray = pathArray.slice(0, -1);

		for(goUpCount; goUpCount--; goUpCount>0) {
			pathArray = pathArray.slice(0, -1);
		}

		path = pathArray.join("/");

		return path;
	},

	sanitizePath: function(path) {
		path = path.replaceAll("//", "/");
		if(path.indexOf("//") >= 0) {
			path = this.sanitizePath(path);
		}

		if(path.lastIndexOf("/") + 1 == path.length) {
			path = path.slice(0, -1);
		}

		if(path.indexOf("/") != 0) {
			path = "/" + path;
		}

		if(!this.isAllowedPath(path)) {
			for(let char of this.forbiddenCharsInPath) {
				path = path.replaceAll(char, "_");
			}
		}

		return path;
	},

	isAllowedPath: function(path) {
		for(let char of this.forbiddenCharsInPath) {
			if(path.indexOf(char) > 0) {
				return false;
			}
		}

		return true;
	},

	listdir: function(path, recurseDepth = 0) {
		path = this.sanitizePath(path);
		if(path == "/") {
			path = "";
		}

		var result = Object.keys(localStorage).filter(key => key !== path);
		var addToResult = [];

		result = result.filter(item => {
			return item.indexOf(path) === 0 && (item.length === path.length || (item[path.length] === '/' && item.indexOf('/', path.length + 1) === -1));
		});

		if(recurseDepth > 0 || recurseDepth == Infinity) {
			for(let item of result) {
				item = this.sanitizePath(item);

				if(this.typeof(item) == "dir" && item != path) {
					for(let subitem of this.listdir(item, (recurseDepth - 1))) {
						addToResult.push(subitem);
					}
				}
			}
		}

		result = result.concat(addToResult);

		return result;
	},

	delete: function(path, recursive = false) {
		path = this.sanitizePath(path);

		if(!this.exists(path)) {
			return false;
		}

		if(this.typeof(path) == "dir") {
			if(this.listdir(path).length > 0) {
				if(!recursive) {
					return false;
				} else {
					for(let item of this.listdir(path)) {
						this.delete(item, true);
					}
				}
			}
		}

		localStorage.removeItem(path);
		return true;
	},


	copy: function(source, destination, override = false) {
		if(!this.isAllowedPath(source) || !this.isAllowedPath(destination)) {
			return false;
		}

		source = this.sanitizePath(source);
		destination = this.sanitizePath(destination);

		if(override == false && this.exists(destination)) {
			return false;
		}

		let file = this.load(source, false);
		let fileAttributes = this.load(source, true);

		this.save(destination, file, fileAttributes, override);

		if(this.typeof(source) == "dir") {
			for(item of this.listdir(source, 0)) {
				let newDestination = destination;
				newDestination = destination + "/" + this.getName(item);
				this.copy(item, newDestination, override);
			}
		}

		return true;
	},

	move: function(source, destination, override = false) {
		if(!this.isAllowedPath(source) || !this.isAllowedPath(destination)) {
			return false;
		}

		source = this.sanitizePath(source);
		destination = this.sanitizePath(destination);

		if(override == false && this.exists(destination)) {
			return false;
		}

		if(this.copy(source, destination, override) == true) {
			this.delete(source, true);
			return true;
		}

		return false;
	}
}


var newScript = document.createElement("script");
newScript.src = "system/system_variable.js";
document.head.appendChild(newScript);
