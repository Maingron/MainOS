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
            newChild.style.order = 5;
            newChild.setAttribute("tabindex", "5");
        } else {
            newChild.style.order = 6;
            newChild.setAttribute("tabindex", "6");
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
    } else if(action == "view_image") {
        window.parent.run('photo-viewer', path);
        return;
    } else if(action == "paint") {
        window.parent.run('paint', path);
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

function toggleFileAttribute(fullFilePath, attribute) {
    if(iofs.exists(fullFilePath)) {
        let sourceFile = iofs.load(fullFilePath);
        let sourceFileAttr = iofs.getInfos(fullFilePath);
        if(sourceFileAttr.attributes && sourceFileAttr.attributes["A"]) {
            if(sourceFileAttr.attributes["A"].indexOf(attribute)>-1) {
                sourceFileAttr.attributes["A"] = sourceFileAttr.attributes["A"].replace(attribute,"");
            } else {
                sourceFileAttr.attributes["A"] += attribute;
            }
        } else {
            sourceFileAttr.attributes["A"] = attribute;
        }
        iofs.save(fullFilePath, sourceFile, sourceFileAttr.attributes, true);
    }

    explorerrefresh();
}

function contextMenu(event) {
    if(event.target.attributes.path) {
        if(iofs.typeof(event.target.attributes.path.value) != "dir") {
            spawnContextMenu([
                ["Open in Notepad", "explorerdo('" + event.target.attributes.path.value + "', 'edit_text')"],
                ["Open in Photo Viewer", "explorerdo('" + event.target.attributes.path.value + "', 'view_image')"],
                ["Open in Paint", "explorerdo('" + event.target.attributes.path.value + "', 'paint')"],
                ["<hr>"],
                ["Toggle Favorite", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'f')"],
                ["Toggle Dot A", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'A')"],
                ["Toggle Dot B", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'B')"],
                ["Toggle Dot C", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'C')"],
                ["Toggle Dot D", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'D')"],
                ["Toggle Dot E", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'E')"],
                ["Toggle Dot F", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'F')"],
                ["<hr>"],
                ["Rename File", "renameFile('"+event.target.attributes.path.value+"','"+currentPath + "renamed File - something.txt"+"')","disabled"],
                ["Delete File","explorer_deletefile('" + event.target.attributes.path.value + "')"],
                ["<hr>"],
                ["Properties","","disabled"]]
            ) // ["Backup File","savefile('" + event.target.attributes.path.value + ' - Copy' + "','" + iofs.load(event.target.attributes.path.value) + "', 0, 't=txt')"]
        } else {
            spawnContextMenu([
                ["Toggle Favorite", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'f')"],
                ["Toggle Dot A", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'A')"],
                ["Toggle Dot B", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'B')"],
                ["Toggle Dot C", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'C')"],
                ["Toggle Dot D", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'D')"],
                ["Toggle Dot E", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'E')"],
                ["Toggle Dot F", "toggleFileAttribute('"+event.target.attributes.path.value+"', 'F')"],
                ["<hr>"],
                ["Delete Folder","explorer_deletefile('" + event.target.attributes.path.value + "',1)"],
                ["<hr>"],
                ["Properties","","disabled"]
            ]);
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
