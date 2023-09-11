var currentPath;
var filesListed = [];

function explorerdo(path, action = "default") { // Shows directory or does stuff asigned to files / file types
    if(path == "..") { // If want to go up a directory
        path = currentPath.slice(0, currentPath.slice(0,-1).lastIndexOf("/")) + "/";

        if(currentPath.slice(-2) == ":/") { // Make sure to be able to display rootdir again
            path = "/";
        }
    }

    if(path.slice(-1) != "/" && isfolder(path)) { // Make sure we're using a trailing slash for folders but not for files
        path += "/";
    }

    if(!isfile(path) && path != "/") { // Go back to currentPath if path is not valid - Used for path input bar, for example; Only if not requesting rootdir (/)
        explorerdo(currentPath, action);
    }

    if(!isfolder(path) && path != "/") { // explorerdofile() instead if is file but only if not requesting rootdir (/)
        explorerdofile(path, action);
        return;
    }


    var filesInPath = window.parent.listdir(path); // List files

    document.getElementById("content_files").innerHTML = ""; // Clear listed files
    filesListed = []; // Clear filesListed


    var newChild;
    for(var i = 0; i < filesInPath.length; i++) {

        newChild = document.createElement("a");
        newChild.setAttribute("path", filesInPath[i]); // Todo: maybe chack for onclick in #content_files and then do explorerdo() with this instead of using href=javascript:*
        newChild.setAttribute("class","has_hover");
        newChild.href = "javascript:explorerdo('"+filesInPath[i]+"')"; // Open folder or file onclick

        // display folders first
        if(isfolder(filesInPath[i])) {
            newChild.style.order = 1;
        } else {
            newChild.style.order = 2;
        }


        newChild.innerText = getFilename(filesInPath[i]); // Add text while removing full path and trailing slash

        document.getElementById("content_files").appendChild(newChild);
        filesListed.push(filesInPath[i]); // Add to filesListed
    }


    document.getElementById("path").value = path;

    currentPath = path;

    runModules(); // Run modules

}




function explorerdofile(path, action) { // Run if program is clicked
    var fileending = path.slice(path.lastIndexOf("."));

    if(action == "edit_text") {
        window.parent.run('notepad', path);
        return;
    }

        if (fileending == ".txt" || fileending == ".log") {
            window.parent.run('notepad', path);
        } else if (fileending == ".png" || fileending == ".jpg" || fileending == ".jpeg") {
            window.parent.run('painthd', path);
        } else if (fileending == ".run") {
            window.parent.run(JSON.parse(loadfile(path)).id);
        }
}


/**
 * 
 * @param {*} path 
 * @param {*} attributes1 
 */

function explorer_deletefile(path, attributes1) {
    var deleteFileHTMLElement = document.querySelector("[path='" + path + "']");
    deleteFileHTMLElement.setAttribute("disabled", "disabled");
    deletefile(path, attributes1);
    deleteFileHTMLElement.remove();
}

function explorerrefresh() {
    explorerdo(currentPath);
}

function newFile(fileName = "New File.txt") {
    if(isfolder(currentPath)) {
        savefile(currentPath + fileName,"",0);
        explorerrefresh();
    }
}

function renameFile(source, target) {
    // TODO: Add input field so we can actually rename
    if(isfile(source)) {
        savefile(target, loadfile(source,0), 0); // TODO: Copy attributes
        // TODO!: Verify file is copied correctly!
        explorer_deletefile(source);
        explorerrefresh();
    }
}

function contextMenu(event) {
    if(event.target.attributes.path) {
        if(!isfolder(event.target.attributes.path.value)) {
            spawnContextMenu([["Edit as Text", "explorerdo('" + event.target.attributes.path.value + "', 'edit_text')"],["<hr>"],["Rename File", "renameFile('"+event.target.attributes.path.value+"','"+currentPath + "renamed File - something.txt"+"')","disabled"], ["Delete File","explorer_deletefile('" + event.target.attributes.path.value + "')"], ["<hr>"], ["Properties","","disabled"]]) // ["Backup File","savefile('" + event.target.attributes.path.value + ' - Copy' + "','" + loadfile(event.target.attributes.path.value) + "', 0, 't=txt')"]
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