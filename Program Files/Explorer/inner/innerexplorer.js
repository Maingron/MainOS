var currentPath;

function explorerdo(path) { // Shows directory or does stuff asigned to files / file types

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
        explorerdo(currentPath);
    }

    if(!isfolder(path) && path != "/") { // explorerdofile() instead if is file but only if not requesting rootdir (/)
        explorerdofile(path);
        return;
    }


    var filesInPath = window.parent.listdir(path); // List files

    document.getElementById("content_files").innerHTML = ""; // Clear listed files


    var newChild;
    for(var i = 0; i < filesInPath.length; i++) {

        newChild = document.createElement("a");
        newChild.setAttribute("path", filesInPath[i]); // Todo: maybe chack for onclick in #content_files and then do explorerdo() with this instead of using href=javascript:*
        newChild.href = "javascript:explorerdo('"+filesInPath[i]+"')"; // Open folder or file onclick

        if(!isfolder(filesInPath[i])) { // If is no folder asign program icon
            newChild.innerHTML = "<img id='animg' src='iofs:C:/mainos/system32/icons/unknown_file.svg'>"; // Add default icon

            var fileending = filesInPath[i].slice(filesInPath[i].lastIndexOf("."));
            if(fileending == ".txt" || fileending == ".log") { // Text documents
                newChild.innerHTML = "<img id='animg' src='iofs:C:/Program Files/notepad/icon.png'>"; // Add icon
            } else if (fileending == ".png" || fileending == ".jpg" || fileending == ".jpeg" || fileending == ".svg") { // Images
                newChild.innerHTML = "<img id='animg' src='iofs:"+filesInPath[i]+"'>"; // Add icon
            }

        } else {
            newChild.innerHTML = "<img id='animg' src='iofs:C:/mainos/system32/icons/folder.svg'>"; // Add icon

            if(filesInPath[i].slice(-2) == ":/") {
                newChild.innerHTML = "<img id='animg' src='iofs:C:/mainos/system32/icons/mainos_folder.svg'>"; // Add icon
                newChild.innerHTML += filesInPath[i]; // Add text
                // newChild.innerHTML += "<meter value='" + loadfile("C:/.diskinfo/size_used.txt") + "' min='0' max='" + loadfile("C:/.diskinfo/size.txt") + "'>&nbsp;</meter>";

                document.getElementById("content_files").appendChild(newChild);
                continue; // End here if is HDD and skip code below
            }
        }

        newChild.innerHTML += filesInPath[i].split(path)[1].split("/")[0]; // Add text while removing full path and trailing slash

        document.getElementById("content_files").appendChild(newChild);

    }


    document.getElementById("path").value = path;

    currentPath = path;

    if(currentPath == "/") { // Show space info in rootdir
        document.getElementById("spaceinfo").style.display = "inline-block";
    } else {
        document.getElementById("spaceinfo").style.display = "none";
    }


    loadIOfsLinks(); // Load icons

}




function explorerdofile(path) { // Run if program is clicked
    var fileending = path.slice(path.lastIndexOf("."));

        if (fileending == ".txt" || fileending == ".log") {
            window.parent.run('notepad', path);
        } else if (fileending == ".png" || fileending == ".jpg" || fileending == ".jpeg") {
            window.parent.run('painthd', path);
        }
}





function deletefileandrefresh(path) {
    deletefile(path);
    explorerrefresh();
}

function explorerrefresh() {
    explorerdo(currentPath);
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
        spawnContextMenu([["Refresh","explorerrefresh()"],["<hr>"],["Properties","","disabled"]])
    }
}


explorerdo("/"); // Initial load of all vHDDs