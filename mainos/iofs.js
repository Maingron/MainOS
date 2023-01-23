var mainos = {};
mainos.versionnr = 180;
mainos.versionnrstring = "00" + mainos.versionnr;
mainos.version = mainos.versionnr;
mainos.versionlt = "0CC";
mainos.settings = {};
mainos.serverpath = "https://maingron.com";
mainos.serverroot = "https://maingron.com/projects/MainOS/server";
mainos.repository = "https://maingron.com/projects/MainOS/server/repository.json";
mainos.creator = "Maingron";
mainos.copyright = "Maingron 2018 - 2022";


var ismainos = 1;
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

        var myLoadResultDate = myLoadResult.split("d=")[1].split(",")[0];

        var myLoadResultDateOld = myLoadResultDate;

        myLoadResultDate = +myLoadResultDate + 1000000000;
        myLoadResultDate = myLoadResultDate + "000";
        myLoadResultDate = myLoadResultDate;

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

function savedir(path) {
  if(isfile(path)) {
  } else {
    if(path.charAt(path.length - 1 ) != "/") {
      path += "/"; // Append trailing slash, if there is none
    }
    savefile(path, "", 0, "t=d");
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

function copyFile(source, destination, doOverride = false) {
  // WIP
  if(isfile(source) && !isfolder(source)) { // If source file does exist and is NOT a folder (for now)
    savefile(destination, loadfile(source), doOverride, loadfile(source, true));
    return true;
  } else {
    return false;
  }
}

function moveFile(source, destination) {
  // WIP
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
      document.body.innerHTML = "<center><br><br><h1>MainOS Formatted; Frozen until restart</h1></center>";
      document.body.innerHTML += "<center><button onclick=\"formatfs('yes', true); window.location.reload();\">Restart</button></center>";
      Object.freeze(mainos = undefined);
      Object.freeze(setting = undefined);
      Object.freeze(program = undefined);
      Object.freeze(appdata = undefined);
      Object.freeze(path = undefined);
    }
  }
}


var newScript = document.createElement("script");
newScript.src = "system/system_variable.js";
document.head.appendChild(newScript);


if (!isfile("C:/mainos/system32/ExpectedVersionnr.txt") || loadfile("C:/mainos/system32/ExpectedVersionnr.txt") < mainos.versionnr) {
  document.write("<script src=\"mainos/createiofs.js\"></script>");
}