var mainos = {
  versionnr: 185,
  versionlt: "0CC",
  serverpath: "https://maingron.com",
  serverroot: "https://maingron.com/projects/MainOS/server",
  repository: "https://maingron.com/projects/MainOS/server/repository.json",
  creator: "Maingron",
  copyright: "Maingron 2018 - 2023"
};

mainos.versionnrstring = "00" + mainos.versionnr;
mainos.version = mainos.versionnr;


var ismainos = 1;
var setting = {}; // deprecated



function listdir(path, listChildren = false) { // List directory // Todo!: add depth parameter

    if(path.slice(-1) != "/") { // Check for trailing slash and add one if not found
        path += "/";
    }


    if(!isfolder(path) && path != "/") { // Return nothing if is not a folder and not requesting rootdir (/)
        return;
    }

    var result = [];

    var fileList = Object.keys(localStorage); // Use fileList instead of Object.keys(localStorage), else result might break because files might be added while in a loop
    if(path == "/") { // If want to see rootdir ("/")
        var rootDirContents = [];

        for (var i = 0; i < fileList.length; i++) {
            if(fileList[i].slice(0, -1).length <= 3) { // Only show rootdir / all HDDs - allow up to 2 letter-drives (C:/ or AB:/)
                if(fileList[i].slice(-1) == "/") { // Make sure to ignore 1-letter-files (C:/t)
                    rootDirContents.push(fileList[i]); // Push HDD into rootDirContents-Array
                }
            }
        }

        fileList = rootDirContents;
        return fileList; // Return HDD list; We're assuming nothing is wrong with the list and skip the actual folder scanning part below
    }



    for (var i = 0; i < fileList.length; i++) { // Do for ALL files

        var myNowFile = fileList[i];

        if(myNowFile.includes(path)) { // Only work on Files / Folders within path
            if(myNowFile.split(path)[1].includes("/")) {
                if(myNowFile.split(path)[1].split("/")[1].length > 1) {
                } else {
                    result.push(myNowFile); // Return folders
                }
            } else {
                result.push(myNowFile); // Return files
            }

        }

    }

    for(var i = 0; i < result.length; i++) { // Remove requested-path (The folder we're asking for) entry from final result in this loop
        if(result[i] == path) { // If entry == requested-path
            if(result[i] != result[0]) { // Make sure not to clone the requested-path entry instead if it happens to be on entry 0
                result[i] = result[0]; // Take entry 0 and put it into requested-path entry
                result.shift(); // Remove the now duplicated entry
            } else {
                result[i] = result[result.length - 1]; // Take last entry and put it into requested-path entry
                result.pop();  // Remove the now duplicated entry
            }
        }
    }

    result = result.sort(); // Apply some bit of sorting - better than nothing but definitely space to be improved

    if(listChildren) { // If requested to list children, recursively run listdir on all children. Append their paths to the result array
        for(var i = 0; i < result.length; i++) {
            if(isfolder(result[i])) {
                var myChildren = listdir(result[i], true);
                for(var j = 0; j < myChildren.length; j++) {
                    result.push(myChildren[j]);
                }
            }
        }
    }

    return result;

}


function loadfile(path,requestattributes = false) {
  const myFile = localStorage.getItem(path);
    // if (localStorage.getItem(path).length < 2 || localStorage.getItem(path).indexOf("*") < 5) { // TODO: Check what this save thing does - probably can be removed
    //   savefile(path, localStorage.getItem(path));
    // }

  if(myFile != null && myFile != "undefined") { // If file exists

    // TODO: This was probably supposed to be some kind of shortcut loader. It was messing up stuff and now it needs to be checked and reimplemented
    // if(myFile.indexOf("loadfile(") > -1) {
    //   if(myFile.indexOf("loadfile('") > -1) {
    //     return(loadfile(myFile.split("loadfile('")[1].split("')")[0].toString()));
    //   } else if(myFile.indexOf("loadfile(\"")> -1) {
    //     return(loadfile(myFile.split("loadfile(\"")[1].split("\")")[0].toString()));
    //   }
    // }


    if(requestattributes == 1) { // Return only file attributes if requested

      var myLoadResult = myFile.split("*")[0];

      if(myLoadResult.includes("d=")) { // only if file has a date

        // - We have to expand the timestamp again, since we removed important parts of it when saving

        let myLoadResultDate = myLoadResultDateOld = myLoadResult.split("d=")[1].split(",")[0];
        myLoadResultDate = dateCompression(false, myLoadResultDate);

        myLoadResult = myLoadResult.replace(myLoadResultDateOld, myLoadResultDate);
    }

      return myLoadResult;
    } else {
      return myFile.split("*")[1];
    }
  } else {
    return myFile;
  }
}

function isfile(path) {
  const myFile = localStorage.getItem(path)
  if (myFile == null || myFile == "undefined") {
    return false;
  } else {
    return true;
  }
}

function isfolder(path) {
	if(!path.endsWith("/")) { // Add trailing slash if not present
		path += "/";
	}

  const myFile = localStorage.getItem(path)
  if(myFile == null || myFile == "undefined") { // If file or folder doesn't exist
      return false;
  } else {
      if(loadfile(path,1).includes("t=dir") || loadfile(path,1).includes("t=d")) { // If attributes of path equal type=dir
          return true;
      } else {
          return false;
      }
  }
}


function isnofile(path) { // Todo: Check if should be depreciated
  if (isfile(path)) {
    return false;
  } else {
    return true;
  }
}

/**
 * Returns the compressed / decompressed date of the input date
 * @param {boolean} gets compressed if true, decompressed if false
 * @param {Date} date Date to compress / decompress
 * @returns {number} Compressed / decompressed date
 **/

function dateCompression(compress = false, date = new Date()) {
  if(compress == true) { // apply compression
    // if not a date, make it one
    if(typeof date != "object") {
      date = new Date(date);
    }
    date = (date.getTime() - date.getMilliseconds()) / 1000; // Save without milliseconds to save about 3 bytes per file
    date -= 1000000000; // Remove this value to save up to 1 byte per file. Won't save storage after the year 2033
  } else { // compress == false -> decompress
    date = +date + 1000000000;
    date = date + "000";
  }
  return +date;
}


function savefile(path, content, override, attr) {
  if (!attr || attr.includes("d=") == false) {
    var mySaveDate = new Date();
    mySaveDate = (mySaveDate.getTime() - mySaveDate.getMilliseconds()) / 1000; // Save without milliseconds to save about 3 bytes per file
    mySaveDate -= 1000000000; // Remove this value to save up to 1 byte per file. Won't save storage after the year 2033
    attr = "d=" + mySaveDate + "," + attr; // Todo: Make the date footprint as small as possible
  } else if(attr && attr.includes("t=dir")) {
    if(path.slice(-1) != "/") { // Check for trailing slash
      console.warn("Directories are supposed to have a trailing slash. Saving: " + path + ".");
      path += "/";
    }
  }

  if (override == "undefined" || override == "null") {
    override = 0;
  }

  if (!override && isfile(path)) {} else {
    localStorage.setItem(path, attr + "*" + content);
  }
}

function savedir(path, createParentStructure = true) {
  if(isfile(path)) {
  } else {
    if(path.charAt(path.length - 1 ) != "/") {
      path += "/"; // Append trailing slash, if there is none
    }
    if(createParentStructure) {
      var myPathArray = path.split("/");
      var myPath = "";
      for(var i = 0; i < myPathArray.length - 1; i++) {
        myPath += myPathArray[i] + "/";
        if(!isfolder(myPath)) {
          savefile(myPath, "", 0, "t=d");
        }
      }
    } else if(!isfolder(path.split("/")[path.split("/").length - 2])) { // If parent folder doesn't exist
      return "Error: Parent folder doesn't exist";
    }
    savefile(path, "", 0, "t=d");
  }
}


function deletefile(path, includeChildren = false) { // Delete a file or folder
  // check if file or folder exists, else return error
  if(!isfile(path) && !isfolder(path)) {
    return "Error: File or folder doesn't exist";
  }
  // if deleting a folder, delete all files in it
  if(isfolder(path) && includeChildren) {
    var myDirList = listdir(path, 1);
    for(var i = 0; i < myDirList.length; i++) {
      deletefile(myDirList[i], 1);
    }
  } else if(isfolder(path) && !includeChildren) {
    return "Error: Can't delete folder without including children";
  }
  localStorage.removeItem(path);
}

function getFilename(path) { // This returns the filename and removes the full path ("C:/users/testuser/test.txt" -> "test.txt")
  var myResult;
  if(isfolder(path)) {
    myResult = path.split("/")[path.split("/").length - 2]; // Return this if is folder
  } else {
    myResult = path.split("/")[path.split("/").length - 1]; // Return this if is file
  }
    return myResult;
}

function copyFile(source, destination, doOverride = false) {
  // WIP
  if(isfile(source) && !isfolder(source)) { // If source file does exist and is NOT a folder (for now)
    savefile(destination, loadfile(source), doOverride, loadfile(source, true));
    return true;
  } else {
    return false;
  }
}

/**
 * Returns the size of a file in bytes
 * @param {String} path Path to file
 * @param {boolean} requestattributes returns either the size of file attributes or only the size of the file content
 * @returns {number} File size in bytes
 */
function getFileSize(path, requestattributes = false) {
		return +loadfile(path, requestattributes).length;
}


function moveFile(source, destination) {
  // WIP
}

/**
 * Returns the foldername of a path
 * @param {String} path Path to file or folder
 * @returns {String} Foldername
 * @example
 * // returns "testuser"
 * getFoldername("C:/users/testuser/test.txt");
 * @example
 * // returns "testuser"
 * getFoldername("C:/users/testuser/");
 */
function getFoldername(path) {
	let result;
	// add trailing slash if not present and is folder
	if(path.slice(-1) != "/" && isfolder(path)) {
		path += "/";
	}
	result = path.split("/")[path.split("/").length - 2]; // Return this if is folder
	return result;
}


/**
 * Lists attributes of a folder / file in an array
 * @param {String} path Path to file or folder
 * @returns {Array} Array of attributes
 */

function getAttributes(path) {
  return loadfile(path, true).split(",");
}

/**
 * sets attributes of a file / folder
 * @param {String} path Path to file or folder
 * @param {String} attribute Attribute to set
 * @param {String} value Value to set attribute to
 **/

function setAttribute(path, attribute, value) {
  var myAttributes = getAttributes(path);
  var myNewAttributes = "";
  if(attribute == "d") { // if attribute is date, compress it
    value = dateCompression(true, value);
  }
  for(var i = 0; i < myAttributes.length; i++) {
    if(myAttributes[i].split("=")[0] == attribute) {
      myNewAttributes += attribute + "=" + value + ",";
    } else {
      myNewAttributes += myAttributes[i] + ",";
    }
  }
  // if attribute doesn't exist, add it
  if(!myNewAttributes.includes(attribute)) {
    myNewAttributes += attribute + "=" + value + ",";
  }

  myNewAttributes = myNewAttributes.slice(0, -1);
  savefile(path, loadfile(path).split("*")[1], 1, myNewAttributes);
}

function formatfs(sure, reload = true) { // Todo: Update
  if (sure == "yes") {
    savefile("C:/mainos/system32/exists.dat", "false");
    localStorage.clear();
    if(reload) {
      window.location.reload();
    } else {
      savefile = undefined;
      savedir = undefined;
      loadfile = undefined;
      document.title += " - Frozen (Formatted; Waiting)";
      document.body.innerHTML = /*html*/`
      <center>
        <br>
        <br>
        <h1>${system.osDetails.name} formatted; Frozen until restart</h1>
        <br>
        <button onclick="window.location.reload();">Restart</button>
      </center>
      `;
      Object.freeze(mainos = undefined);
      Object.freeze(setting = undefined);
      Object.freeze(program = undefined);
      Object.freeze(appdata = undefined);
      Object.freeze(system = undefined);
    }
  }
}


var newScript = document.createElement("script");
newScript.src = "system/system_variable.js";
document.head.appendChild(newScript);


if (!isfile("C:/mainos/system32/ExpectedVersionnr.txt") || loadfile("C:/mainos/system32/ExpectedVersionnr.txt") < mainos.versionnr) {
  document.write("<script src=\"mainos/createiofs.js\"></script>");
}