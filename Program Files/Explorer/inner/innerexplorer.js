function explorerdo(nowpath) {
  var currentpath;
  var parentpath;
  var nowpath;
  var fscontents = window.parent.listfs();
  var fscontentsnr = 0;
  var contentfiles = document.getElementById("content_files");
  currentpath = nowpath;
  parentpath = currentpath.split("/");
  var newparentpath = "";
  var parentpathnr = 0;
  while (parentpathnr < parentpath.length) {
    newparentpath = newparentpath + parentpath[parentpathnr] + "/";
    parentpathnr++;
  }
  if (newparentpath.indexOf("//") > -1) {
    newparentpath = newparentpath.split("//")[0] + newparentpath.split("//")[1];
  }
  if (newparentpath.length == 0) {
    newparentpath = " /";
  };
  document.getElementById("mypathrn").value = newparentpath;

  document.getElementById("gooneup").onclick = function() {
    explorerdo(newparentpath.split(newparentpath.split("/")[newparentpath.split("/").length - 2])[0] + "/")
  };


  contentfiles.innerHTML = "";
  while (fscontentsnr < fscontents.length) {
    var mycurrentfile = fscontents[fscontentsnr];
    if (newparentpath == " /" && mycurrentfile.length == 3 && mycurrentfile.indexOf(":/") == 1) {
      contentfiles.innerHTML = contentfiles.innerHTML + "<button onclick='explorerdo(\"" + fscontents[fscontentsnr] + "/\")'><img src='../../../img/windows_folder.svg'><p>" + fscontents[fscontentsnr] + "</p></button>";
    } else {
      //window.alert(mycurrentfile + ";" + mycurrentfile.indexOf(currentpath));
      if ((mycurrentfile.match(/\//g) || []).length == (newparentpath.match(/\//g) || []).length && mycurrentfile.length > 3 && mycurrentfile.indexOf(newparentpath) > -1) {
        if (mycurrentfile.indexOf(".") == mycurrentfile.length - 4) {
          contentfiles.innerHTML = contentfiles.innerHTML + "<button class='aonefile' onclick='//explorerdo(\"" + fscontents[fscontentsnr] + "\")'><img id='animg' src='../../../img/unknown_file.svg'><p>" + mycurrentfile.split(newparentpath)[1] + "</p></button>";
        } else {
          contentfiles.innerHTML = contentfiles.innerHTML + "<button class='aonefile' onclick='explorerdo(\"" + fscontents[fscontentsnr] + "\")'><img id='animg' src='../../../img/folder.svg'><p>" + mycurrentfile.split(newparentpath)[1] + "</p></button>";
        }
      }
    }
    fscontentsnr++;
  }

  //set icon to filetypeicon below

  var mylistedfiles = document.getElementsByClassName("aonefile");
  var mylistedfilesnr = 0;
  while (mylistedfilesnr < mylistedfiles.length) {
    var mylistedfile_inner = mylistedfiles[mylistedfilesnr].querySelector("p").innerHTML;
    var mylistedfile_img = mylistedfiles[mylistedfilesnr].querySelector("img");

    if (mylistedfile_inner.indexOf(".txt") == mylistedfile_inner.length - 4 || mylistedfile_inner.indexOf(".log") == mylistedfile_inner.length - 4) {
      mylistedfiles[mylistedfilesnr].setAttribute("onClick", "javascript: window.parent.run('notepad', '" + newparentpath + mylistedfile_inner + "');");
      mylistedfile_img.src = "../../../Program%20Files/notepad/icon.png";
    }
    if (mylistedfile_inner.indexOf(".dat") == mylistedfile_inner.length - 4) {
      mylistedfile_img.src = "../../../img/unknown_file.png";
    }
    if (mylistedfile_inner.indexOf(".xec") == mylistedfile_inner.length - 4) {
      mylistedfiles[mylistedfilesnr].setAttribute("onClick", "window.parent.run('" + mylistedfile_inner.split('.xec')[0] + "')");
      mylistedfile_img.src = "../../../Program%20Files/" + mylistedfile_inner.split(".xec")[0] + "/icon.png";
    }

    if (mylistedfile_inner.indexOf(".del") == mylistedfile_inner.length - 4) {
      mylistedfiles[mylistedfilesnr].setAttribute("onClick", "window.parent.formatfs('yes')");
      mylistedfile_img.src = "../../../img/unknown_file.png";
    }


    mylistedfilesnr++;
  }


}

explorerdo(" ");
