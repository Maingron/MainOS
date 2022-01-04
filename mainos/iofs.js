var mainos = {};
mainos.versionnr = 175;
mainos.versionnrstring = "00" + mainos.versionnr;
mainos.version = mainos.versionnr;
mainos.versionlt = "0CC";
mainos.settings = {};

var ismainos = 1;
var appdata = "C:/Documents and Settings/appdata";
var setting = {};



function listdir(path) { // List directory // Todo!: add depth parameter

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

    return result;

}


function loadfile(path,requestattributes = false) {
  if (localStorage.getItem(path) != 0 && localStorage.getItem((path)) != null) {
    if (localStorage.getItem(path).length < 2 || localStorage.getItem(path).indexOf("*") < 5) { // TODO: Check what this save thing does - probably can be removed
      savefile(path, localStorage.getItem(path));
    }

    if(localStorage.getItem(path).indexOf("loadfile(") > -1) {
      if(localStorage.getItem(path).indexOf("loadfile('") > -1) {
        return(loadfile(localStorage.getItem(path).split("loadfile('")[1].split("')")[0].toString()));
      } else if(localStorage.getItem(path).indexOf("loadfile(\"")> -1) {
        return(loadfile(localStorage.getItem(path).split("loadfile(\"")[1].split("\")")[0].toString()));
      }
    }

    if(requestattributes == 1) { // Return only file attributes if requested
      return localStorage.getItem((path)).split("*")[0];
    } else {
      return localStorage.getItem((path)).split("*")[1];
    }
  } else {
    return localStorage.getItem(path);
  }
}

function isfile(path) {
  if (localStorage.getItem(path) == null || localStorage.getItem(path) == "undefined") {
    return false;
  } else {
    return true;
  }
}

function isfolder(path) {
  if(localStorage.getItem(path) == null || localStorage.getItem(path) == "undefined") { // If file or folder doesn't exist
      return false;
  } else {
      if(loadfile(path,1) == "t=dir") { // If attributes of path equal type=dir
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


function savefile(path, content, override, attr) {
  if (attr == "null" || attr == "undefined") {
    attr = "d=" + new Date.now();
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

function savedir(path) {
  if(isfile(path)) {
  } else {
    savefile(path, "", 0, "t=dir");
  }
}


function deletefile(path) { // Delete a file // Todo: improve
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


function formatfs(sure) { // Todo: Update
  if (sure == "yes") {
    savefile("C:/mainos/system32/exists.dat", "false");
    localStorage.clear();
    var allmyfiles = listfs().toString().split(",");
    var allmyfilesnr = 0;
    while (allmyfilesnr < allmyfiles.length) {
      localStorage.removeItem(allmyfiles[allmyfilesnr]);
      allmyfilesnr++;
    }
    window.location.reload();
  }
}

if (!isfile("C:/mainos/system32/ExpectedVersionnr.txt") || loadfile("C:/mainos/system32/ExpectedVersionnr.txt") < mainos.versionnr) {
  document.write("<script src=\"mainos/createiofs.js\"></script>");
}