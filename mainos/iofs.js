function listfs(path) {
  var mylist = "";
  for (var i = 0; i < Object.keys(localStorage).length; i++) {
    mylist = mylist + Object.keys(localStorage)[i] + ",";
    mylist = mylist.split(",");
  }
  return mylist;
}



function loadfile(path) {

  if (localStorage.getItem(path) != 0 && localStorage.getItem((path)) != null) {
    if (localStorage.getItem(path).length < 2 || localStorage.getItem(path).indexOf("***") < 5) {
      savefile(path, localStorage.getItem(path));
    }
    return localStorage.getItem((path)).split("***")[1];
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

  if (override == 0 && isfile(path)) {

  } else {
    localStorage.setItem(path, attr + "***" + content);
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



if (isfile("C:/mainos/system32/ExpectedVersionnr.txt") == 0 || loadfile("C:/mainos/system32/ExpectedVersionnr.txt") < mainos.versionnr) {
  document.write("<script src=\"mainos/createiofs.js\"></script>");
}