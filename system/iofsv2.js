"use strict";

export const iofs = {
	forbiddenCharsInPath: ['*', '?', '#', '$', '\'', '"', '`', '\\', '§', ',', '\r', '\n'],

	save: function(path, content, attributes = false, override = false, recursive = false, isRaw = true) {
		var attributesFromFileInFS = this.getInfos(path)?.attributes || {};
		path = this.sanitizePath(path);

		if(!this.isAllowedPath(path)) {
			return false;
		}

		if(!override && this.exists(path)) {
			return false;
		}

		if(attributesFromFileInFS["l"] != undefined) {
			// Prevent writing content into links
			return false;
		}

		if(attributes == false && this.exists(path)) {
			attributes = attributesFromFileInFS || "";
		}

		if(typeof(attributes) == "object") {
			let newAttributes = [];
			for(let attributePart of Object.keys(attributes)) {
				newAttributes.push(attributePart + "=" + attributes[attributePart]);
			}
			attributes = newAttributes.join(",");
		}

		attributes = "" + attributes;

		if(attributesFromFileInFS["c"] == undefined) {
			attributes += ",c=" + ((system?.runtime?.time()?.getTime()) ?? 0);
		} else {
			attributes += ",c=" + attributesFromFileInFS["c"];
		}

		attributes += ",d=" + ((system?.runtime?.time()?.getTime() ?? 0));

		if(attributes.indexOf("t=d") >= 0) {
			var isFolder = true;
		}

		if(isRaw) {
			content = btoa(content);
		} else {
			if(content.includes(";base64,")) {
				// Automatically remove base64 prefix to avoid issues
				content = content.split(";base64,")[1];
			}
		}

		// TODO: Add time / change time

		if(isFolder) {
			localStorage.setItem(path, attributes);
		} else {
			localStorage.setItem(path, attributes + "*" + content);
		}

		return true;
	},

	saveLink: function(path, targetPath, linkAttributes = "0a", override = false) {
		path = this.sanitizePath(path);
		let attributes = "l$=" + linkAttributes;
		// link types / attributes
		// 0 = iofs
		// 1 = external mainos resource
		// 2 = generic http / https link
		//
		// a = cachable
		// A = non-cachable

		if(linkAttributes.indexOf("0") >= 0) {
			targetPath = this.sanitizePath(targetPath);
			if(!this.isAllowedPath(targetPath) || !this.exists(targetPath)) {
				return false;
			}
		}

		if(!this.isAllowedPath(path)) {
			return false;
		}


		return this.save(path, "", attributes + ",l=" + targetPath, override, false, true);
	},

	load: function(path, raw = 1) {
		if(!this.isAllowedPath(path)) {
			return null;
		}

		path = this.sanitizePath(path);

		if(!this.exists(path)) {
			return null;
		}

		// If is link, load target file instead
		if(this.getInfos(path).attributes["l"] != undefined) {
			if(this.getInfos(path).attributes["l$"] != undefined) {
				let l$ = this.getInfos(path).attributes["l$"].split("");
				if(l$.includes("0")) { // iofs link
					return this.load(this.getInfos(path).attributes["l"], raw);
				} else if(l$.includes("1") || l$.includes("2")) { // external resource+
					return iofs.loadExternalSync(this.getInfos(path).attributes["l"]);
				}
			} else {
				return this.load(this.getInfos(path).attributes["l"], raw);
			}
		}

		var fullFileContent;

		if(this.typeof(path) == "dir") {
			fullFileContent = "t=d*" + JSON.stringify(this.listdir(path));
		} else {
			fullFileContent = localStorage.getItem(path);
		}

		var requestedContent = "";
		requestedContent = fullFileContent.split("*")[1];

		if(this.typeof(path) == "dir") {
			requestedContent = JSON.parse(requestedContent);
		} else if(this.typeof(path) == "link") {
			return this.load(this.getInfos(path).attributes["l"], raw);
		}

		if(this.typeof(path) == "dir") {
			if(raw && typeof(requestedContent) == "object") {
				requestedContent = JSON.stringify(requestedContent);
			} else if(!raw && typeof(requestedContent) != "object") {
				requestedContent = JSON.parse(requestedContent);
			}
		}

		switch (raw) {
			case -1:
				// requestedContent = requestedContent;
				break;

			case 0:
			case false:
				requestedContent = this.getInfos(path).mime.base64prefix + requestedContent;
				break;

			case 1:
			case true:
				if(this.typeof(path) != "dir") {
					requestedContent = atob(requestedContent)
				}
				break;
		}

		return requestedContent;
	},

	getInfos(path) {
		if(!this.isAllowedPath(path)) {
			return null;
		}

		path = this.sanitizePath(path);

		if(!this.exists(path)) {
			return null;
		}

		const mime = {
			text: {
				__: {
					desc: "Text File",
					prb64: false,
					end: [],
					icon: system?.icons?.filetypes?.text
				},
				plain: {
					end: ["txt", "log", "ini", "cfg", "conf", "inf"],
					desc: "Plain Text File"
				},
				javascript: {
					end: ["js", "mjs"]
				},
				html: {
					end: ["html", "htm", "shtml", "xhtml"]
				},
				xml: {
					end: ["xml"]
				},
				csv: {
					end: ["csv"]
				},
				css: {
					end: ["css"]
				},
				scss: {
					end: ["scss", "sass"]
				},
				json: {
					end: ["json"]
				},
				markdown: {
					end: ["md", "markdown"]
				}
			},
			font: {
				__: {
					desc: "Font File",
					end: []
				},
				truetype: {
					end: ["ttf", "ttc"]
				},
				opentype: {
					end: ["otf"]
				},
				woff: {
					end: ["woff"]
				},
				woff2: {
					end: ["woff2"]
				}
			},
			image: {
				__: {
					desc: "Image",
					prb64: true,
					end: [],
					icon: system?.icons?.filetypes?.image
				},
				avif: {
					end: ["avif"]
				},
				bmp: {
					end: ["bmp"]
				},
				heic: {
					end: ["heic", "heif", "hif"]
				},
				jpg: {
					end: ["jpg", "jpeg", "jpe", "jxl"]
				},
				png: {
					end: ["png", "apng"]
				},
				webp: {
					end: ["webp"]
				},
				gif: {
					end: ["gif"]
				},
				ico: {
					mime: "x-icon",
					end: ["ico", "cur"]
				},
				svg: {
					mime: "svg+xml",
					end: ["svg", "svgz"]
				},
				tiff: {
					end: ["tiff", "tif"]
				}
			},
			video: {
				__: {
					desc: "Video",
					end: []
				},
				mp4: {
					end: ["mp4", "m4v"]
				},
				avi: {
					end: ["avi"]
				},
				mov: {
					end: ["mov"]
				},
				mkv: {
					end: ["mkv"]
				},
				flv: {
					end: ["flv"]
				},
				webm: {
					end: ["webm"]
				}
			},
			audio: {
				__: {
					desc: "Music",
					end: []
				},
				wav: {
					end: ["wav"]
				},
				mpeg: {
					end: ["mp3"]
				},
				ogg: {
					end: ["ogg", "oga"]
				},
				flac: {
					end: ["flac"]
				},
				aac: {
					end: ["aac"]
				},
				midi: {
					end: ["mid", "midi"]
				},
				wma: {
					end: ["wma"]
				}
			},
			application: {
				__: {
					desc: "",
					end: []
				},
				"7z": {
					desc: "7-Zip Archive",
					end: ["7z"]
				},
				"octet-stream": {
					desc: "Binary File",
					prb64: true,
					end: ["bin", "exe", "dll", "dat"]
				},
				rar: {
					desc: "RAR Archive",
					end: ["rar"]
				},
				zip: {
					desc: "Zip Archive",
					end: ["zip"]
				},
				pdf: {
					desc: "PDF Document",
					end: ["pdf"]
				},
				epub: {
					desc: "ePub Document",
					end: ["epub"]
				},
				run: {
					desc: "MainOS Executable",
					end: ["run"]
				}
			}
		};

		var preResult = {
			attributesRaw: localStorage.getItem(path).split("*")[0].split(","),
			attributes: {}
		};

		for(let attribute of preResult.attributesRaw) {
			if(attribute?.split("=")[1]) {
				preResult.attributes[attribute.split("=")[0]] = attribute.split("=")[1];
			}
		}

		var result = {
			get name() {
				return iofs.getName(path);
			},
			ending: undefined,
			mime: {
				category: undefined,
				type: undefined,
				actualType: undefined,
				base64prefix: undefined,
				description: undefined
			},
			probablyWantRaw: true,
			get attributes() {
				return preResult.attributes;
			},
			get attributesRaw() {
				return preResult.attributesRaw;
			},
			get type() {
				return iofs.typeof(path);
			},
			get size() {
				return localStorage.getItem(path).length;
			},
			get timeCreated() {
				return new Date(+(this.attributes["c"] ?? 0));
			},
			get timeModified() {
				return new Date(+(this.attributes["d"] ?? this.attributes["c"] ?? 0));
			}
		}

		result.ending = result.name.split(".").pop();

		if(result.type == "dir") {
			result.ending = "/";
			return result;
		}

		for(let category of Object.keys(mime)) {
			for(let fileType of Object.keys(mime[category])) {
				if(mime[category][fileType].end.includes(result.ending)) {
					result.mime.category = category;
					result.mime.type = fileType;
					result.mime.actualType = mime[category][fileType].mime ?? result.mime.type;
					result.mime.description = mime[category][fileType].desc ?? mime[category].__.desc ?? "";
					result.mime.base64prefix = "data:" + result.mime.category + "/" + result.mime.actualType + ";base64,";

					if(typeof(mime[category][fileType].prb64) != "undefined") {
						result.probablyWantRaw = !mime[category][fileType].prb64;
					} else if(typeof(mime[category].__.prb64) != "undefined") {
						result.probablyWantRaw = !mime[category].__.prb64;
					} else {
						result.probablyWantRaw = true;
					}

					if(mime[category][fileType].icon || mime[category].__.icon) {
						result.icon = mime[category].__.icon;
						if(mime[category][fileType].icon) {
							result.icon = mime[category][fileType].icon;
						}
					} else {
						result.icon = system?.icons?.unknown_file;
					}

					return result;
				}
			}
		}

		return result;
	},

	loadExternal: function(path, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", path, true);
		xhr.responseType = "blob";
		xhr.onload = function(e) {
			if(this.status == 200) {
				var fileReader = new FileReader();
				fileReader.onload = function(event) {
					// The result is now a Data URL
					var result = event.target.result;
					callback(atob(result.split("base64,")[1]));
				}
				// Correctly use readAsDataURL on the blob response
				fileReader.readAsDataURL(this.response);
			}
		}
		xhr.send();
	},

	loadExternalSync: function(path) {
		var xhr = new XMLHttpRequest();
		try {
			xhr.open("GET", path, false);
			xhr.send();
			if(xhr.status == 200) {
				return xhr.responseText;
			}
		} catch (e) {
			return null;
		}
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

		let myType = localStorage.getItem(path).split("*")[0];

		if(myType.indexOf("t=d") >= 0) {
			return "dir";
		} else if(myType.indexOf("l=") >= 0) {
			return "link";
		} else {
			return "file";
		}
		
	},

	getName: function(path) {
		path = this.sanitizePath(path);

		let pathArray = path.split("/");

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

	sanitizePath: function(path = "") {
		path = path.replaceAll("//", "/");
		path = path.replaceAll("#iofs:", "");
		path = path.replaceAll("iofs:", "");
		path = path.replaceAll("#:", "");

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

		result.sort();

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

		if(!this.exists(source)) {
			return false;
		}

		source = this.sanitizePath(source);
		destination = this.sanitizePath(destination);

		if(override == false && this.exists(destination)) {
			return false;
		}

		let file = this.load(source);
		let fileInfos = this.getInfos(source);

		this.save(destination, file, fileInfos.attributes, override);

		if(fileInfos.type == "dir") {
			for(let item of this.listdir(source, 0)) {
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
	},

	exportImage: function() {
		let fsImage = JSON.stringify(localStorage);
		
		return fsImage;
	},

	importImage: function(iofsJSON, sure = false) {
		if(!sure) {
			return false;
		}

		iofsJSON = JSON.parse(iofsJSON);

		localStorage.clear();

		for(let fileName of Object.keys(iofsJSON)) {
			let file = iofsJSON[fileName];
			localStorage.setItem(fileName, file);
		}
	}
}

// } else {
	// var installedVersion = JSON.parse(iofs.load("C:/system/registry"))["system"]["installedVersion"];

// if(installedVersion < )
// }

// if (!iofs.exists("C:/mainos/system32/ExpectedVersionnr.txt") || iofs.load("C:/mainos/system32/ExpectedVersionnr.txt") < mainos.versionnr) {
// }





var newScript = document.createElement("script");
newScript.src = "system/system_variable.js";
document.head.appendChild(newScript);
