var mainos = {};
mainos.versionnr = 175;
mainos.versionnrstring = "00" + mainos.versionnr;
mainos.version = mainos.versionnr;
mainos.versionlt = "0CC";
mainos.settings = {};

var ismainos = 1;
var appdata = "C:/Documents and Settings/appdata";
var setting = {};

/*
0BN - 00090
0BO - 00100
00110+ = 0CC
*/





function listfs(path) {
  if (!path) {
    path = "";
  }
  var mylist = [];
  for (i = 0; i < Object.keys(localStorage).length; i++) {
    mylist.push(Object.keys(localStorage)[i]);
    if (Object.keys(localStorage)[i].indexOf(path) != -1) {
    } else {
      mylist.pop();
    }
  }
  return mylist;
}


function loadfile(path,requestattributes = 0) {
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
    return (0);
  } else {
    return (1);
  }
}

function isfolder(path) {
  if(localStorage.getItem(path) == null || localStorage.getItem(path) == "undefined") {
    return 0;
  } else {
    if(loadfile(path,1) == "t=dir") {
      return 1;
    } else {
      return 0;
    }
  }
}


function isnofile(path) {
  if (isfile(path)) {
    return (0);
  } else {
    return (1);
  }
}


function savefile(path, content, override, attr) {
  if (attr == "null" || attr == "undefined") {
    attr = "d=" + new Date.now();
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


function deletefile(path) {
  localStorage.removeItem(path);
}


function formatfs(sure) {
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