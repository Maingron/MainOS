var currentPath;
var filesListed = [];

function explorerdo(path, action = "default") { // Shows directory or does stuff asigned to files / file types
    if(path == "..") { // If want to go up a directory
        path = iofs.getPath(currentPath);

        if(currentPath.slice(-2) == ":/") { // Make sure to be able to display rootdir again
            path = "/";
        }
    }

    if(!iofs.exists(path) && path != "/") {
        explorerdo(currentPath, action);
    }

    if(iofs.exists(path) && iofs.typeof(path) == "file" && path != "/") { // explorerdofile() instead if is file but only if not requesting rootdir (/)
        explorerdofile(path, action);
        return;
    }


    var filesInPath = iofs.listdir(path, 0); // List files

    document.getElementById("content_files").innerHTML = ""; // Clear listed files
    filesListed = []; // Clear filesListed

    let newChild;
    for(let file of filesInPath) {
        newChild = document.createElement("a");
        newChild.setAttribute("path", file);
        newChild.classList.add("has_hover");
        newChild.href = "javascript:explorerdo('" + file + "')";

        if(iofs.typeof(file) == "dir") {
            newChild.style.order = 1;
            newChild.setAttribute("tabindex", "1");
        } else {
            newChild.style.order = 2;
            newChild.setAttribute("tabindex", "2");
        }

        newChild.innerText = iofs.getName(file); // Add text while removing full path and trailing slash

        document.getElementById("content_files").appendChild(newChild);
        filesListed.push(file); // Add to filesListed

    }


    document.getElementById("path").value = path;

    currentPath = path;

    runModules(); // Run modules

}




function explorerdofile(path, action) { // Run if program is clicked
    var fileinfos = iofs.getInfos(path);
    let filename = fileinfos.name;
    var fileending = fileinfos.ending;

    if(action == "edit_text") {
        window.parent.run('notepad', path);
        return;
    }

    if(fileinfos.mime.category == "text") {
        window.parent.run("notepad", path);
    } else if(fileinfos.mime.category == "image") {
        window.parent.run("paint", path);
    } else if(fileending == "run") {
        window.parent.run(JSON.parse(iofs.load(path)).id);
    }
}

/**
 * 
 * @param {*} path 
 */

function explorer_deletefile(path) {
    var deleteFileHTMLElement = document.querySelector("[path='" + path + "']");
    deleteFileHTMLElement.setAttribute("disabled", "disabled");
    iofs.delete(path, true);
    deleteFileHTMLElement.remove();
}

function explorerrefresh() {
    explorerdo(currentPath);
}

function newFile(fileName = "New File.txt") {
    if(iofs.exists(currentPath) && iofs.typeof(currentPath) == "dir") {
        iofs.save(currentPath + "/" + fileName, "", false);
        explorerrefresh();
    }
}

function renameFile(source, target) {
    // TODO: Add input field so we can actually rename
    if(iofs.exists(source)) {
        iofs.move(source, target, false);
        explorerrefresh();
    }
}

function contextMenu(event) {
    if(event.target.attributes.path) {
        if(iofs.typeof(event.target.attributes.path.value) != "dir") {
            spawnContextMenu([["Edit as Text", "explorerdo('" + event.target.attributes.path.value + "', 'edit_text')"],["<hr>"],["Rename File", "renameFile('"+event.target.attributes.path.value+"','"+currentPath + "renamed File - something.txt"+"')","disabled"], ["Delete File","explorer_deletefile('" + event.target.attributes.path.value + "')"], ["<hr>"], ["Properties","","disabled"]]) // ["Backup File","savefile('" + event.target.attributes.path.value + ' - Copy' + "','" + iofs.load(event.target.attributes.path.value) + "', 0, 't=txt')"]
        } else {
            spawnContextMenu([["Delete Folder","explorer_deletefile('" + event.target.attributes.path.value + "',1)"], ["Properties","","disabled"]])
        }
    } else {
        spawnContextMenu([["Refresh","explorerrefresh()"],["<hr>"],["New File","newFile()"],["<hr>"],["Properties","","disabled"]])
    }
}

var attachedModules = [];
function runModules(event) {
    // Run modules
    for(var i = 0; i < attachedModules.length; i++) {
        attachedModules[i](event);
    }
}

explorerdo("/"); // Initial load of all vHDDs
