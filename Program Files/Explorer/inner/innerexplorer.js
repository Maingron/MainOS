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

  // document.getElementById("refreshdir").onclick = function() {
  //   explorerdo(newparentpath + "/")
  // };



  contentfiles.innerHTML = "";
  while (fscontentsnr < fscontents.length) {
    var mycurrentfile = fscontents[fscontentsnr];
    if (newparentpath == " /" && mycurrentfile.length == 3 && mycurrentfile.indexOf(":/") == 1) {
      contentfiles.innerHTML = contentfiles.innerHTML + "<button path='" + fscontents[fscontentsnr] + "' onclick='explorerdo(\"" + fscontents[fscontentsnr] + "/\")'><img src='iofs:C:/mainos/system32/icons/mainos_folder.svg'><p>" + fscontents[fscontentsnr] + "</p><meter value='" + loadfile("C:/.diskinfo/size_used.txt") + "' min='0' max='" + loadfile("C:/.diskinfo/size.txt") + "'>&nbsp;</meter></button>";
    } else {
      //window.alert(mycurrentfile + ";" + mycurrentfile.indexOf(currentpath));
      if ((mycurrentfile.match(/\//g) || []).length == (newparentpath.match(/\//g) || []).length && mycurrentfile.length > 3 && mycurrentfile.indexOf(newparentpath) > -1) {
        if (mycurrentfile.indexOf(".") == mycurrentfile.length - 4) {
          contentfiles.innerHTML = contentfiles.innerHTML + "<button class='aonefile' path='" + fscontents[fscontentsnr] + "' onclick='//explorerdo(\"" + fscontents[fscontentsnr] + "\")'><img id='animg' src='iofs:C:/mainos/system32/icons/unknown_file.svg'><p>" + mycurrentfile.split(newparentpath)[1] + "</p></button>";
        } else {
          contentfiles.innerHTML = contentfiles.innerHTML + "<button class='aonefile' path='" + fscontents[fscontentsnr] + "' onclick='explorerdo(\"" + fscontents[fscontentsnr] + "\")'><img id='animg' src='iofs:C:/mainos/system32/icons/folder.svg'><p>" + mycurrentfile.split(newparentpath)[1] + "</p></button>";
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
      mylistedfile_img.src = parent.loadfile("C:/Program Files/notepad/icon.png");
    }

    if (mylistedfile_inner.indexOf(".png") == mylistedfile_inner.length - 4 || mylistedfile_inner.indexOf(".jpg") == mylistedfile_inner.length - 4 || mylistedfile_inner.indexOf(".gif") == mylistedfile_inner.length - 4)  {
      mylistedfiles[mylistedfilesnr].setAttribute("onClick", "javascript: window.parent.run('paint2', '" + newparentpath + mylistedfile_inner + "');");
      mylistedfile_img.src = parent.loadfile(newparentpath + mylistedfile_inner);
    }

    if (mylistedfile_inner.indexOf(".svg") == mylistedfile_inner.length - 4) {
      mylistedfile_img.src = parent.loadfile(newparentpath + mylistedfile_inner);
    }

    if (mylistedfile_inner.indexOf(".dat") == mylistedfile_inner.length - 4) {
      mylistedfile_img.src = "iofs:C:/mainos/system32/icons/unknown_file.svg";
    }
    if (mylistedfile_inner.indexOf(".xec") == mylistedfile_inner.length - 4) {
      mylistedfiles[mylistedfilesnr].setAttribute("onClick", "window.parent.run('" + mylistedfile_inner.split('.xec')[0] + "')");
      mylistedfile_img.src = "../../../Program%20Files/" + mylistedfile_inner.split(".xec")[0] + "/icon.png";
    }

    if (mylistedfile_inner.indexOf(".del") == mylistedfile_inner.length - 4) {
      mylistedfiles[mylistedfilesnr].setAttribute("onClick", "window.parent.formatfs('yes')");
      mylistedfile_img.src = "iofs:C:/mainos/system32/icons/unknown_file.svg";
    }


    mylistedfilesnr++;
  }


  loadIOfsLinks();


}

explorerdo(" ");

function deletefileandrefresh(path) {
  deletefile(path);
  explorerdo(document.getElementById("mypathrn").value + "/");
}

function contextMenu(event) {
  if(event.target.attributes.path) {
    console.log(isfolder(event.target.attributes.path.value));
    if(!isfolder(event.target.attributes.path.value)) {
      spawnContextMenu([["Delete File","deletefileandrefresh('" + event.target.attributes.path.value + "')"], ["<hr>"], ["Properties","","disabled"]]) // ["Backup File","savefile('" + event.target.attributes.path.value + ' - Copy' + "','" + loadfile(event.target.attributes.path.value) + "', 0, 't=txt')"]
    } else {
      spawnContextMenu([["Properties","","disabled"]])
    }
  } else {
    spawnContextMenu([["Refresh","explorerdo(document.getElementById('mypathrn').value + '/')"],["<hr>"],["Properties","","disabled"]])
  }
}