document.documentElement.style.setProperty("--themecolor", window.parent.setting.themecolor);
document.documentElement.style.setProperty("--font", window.parent.setting.font);
document.documentElement.style.setProperty("--hovercolor", window.parent.setting.hovercolor);
document.documentElement.style.setProperty("--hovercolornontransparent", window.parent.setting.hovercolornontransparent);

var ismainos;

if (parent.setting.notsodarkmode == 1) {
    document.documentElement.style.setProperty("--black", "#151515");
    document.documentElement.style.setProperty("--black2", "#444");
    document.documentElement.style.setProperty("--black3", "#555");
    document.documentElement.style.setProperty("--black4", "#666");
    document.documentElement.style.setProperty("--black5", "#757575");
}

var data = {};
data.system = {};
data.system.mouse = {};
data.mypid = (window.parent.pid.length - 1);




if(ismainos != 1 && parent.ismainos == 1) {
    // IOfs
    window.loadfile = parent.loadfile;
    window.savefile = parent.savefile;
    window.isfile = parent.isfile;
    window.deletefile = parent.deletefile;
    window.savedir = parent.savedir;
    window.isfolder = parent.isfolder;
    window.listdir = parent.listdir;
    window.getFilename = parent.getFilename;

    // Alerts / Notifications
    window.alert = alert = parent.notification;

    /* TODO:
    window.close
    window.maximize
    window.minimize */


    data.programmeta = {};

    for(var i = 0; i < document.getElementsByTagName("meta").length; i++) { // depreciated
        if(document.getElementsByTagName("meta")[i] && document.getElementsByTagName("meta")[i].getAttribute("version")) {
            data.programmeta.version = document.getElementsByTagName("meta")[i].getAttribute("version");
        }
    }

    if(!data.programmeta.version) {
        data.programmeta.version = 0;
        console.warn("Program " + parent.thisprogram.title + " doesn't have a program version in meta tags. Please add a <meta version=xx> to your <head>.");
    }
}




// Load iofs:*-paths that are found in HTML Elements
function loadIOfsLinks() {
    for(var i = 0; i < document.getElementsByTagName("*").length; i++) { // TODO: Possible performance improvement by checking for Array[img, script, ...] instead of the entire page
        if(document.getElementsByTagName("*")[i].src) {
            if(document.getElementsByTagName("*")[i].src.includes("iofs:")) {
                document.getElementsByTagName("*")[i].src = loadfile(document.getElementsByTagName("*")[i].src.split("iofs:")[1]);
            }
        }
        if(document.getElementsByTagName("*")[i].href) {
            if(document.getElementsByTagName("*")[i].href.includes("iofs:")) {
                document.getElementsByTagName("*")[i].href = loadfile(document.getElementsByTagName("*")[i].href.split("iofs:")[1]);
            }
        }
    }
}

loadIOfsLinks();

window.setInterval(function() {
    loadIOfsLinks();
},20)



document.addEventListener("contextmenu", function (event) {
    console.log(event);
    if (event.ctrlKey != true || event.shiftKey != true) {
        event.preventDefault();
        data.system.mouse.x = event.clientX;
        data.system.mouse.y = event.clientY;
        if (typeof contextMenu === "function") {
            contextMenu(event);
        }
    }
});


function spawnContextMenu(content) { // TODO: Make async
    if (document.getElementsByClassName("contextMenu")[0]) {
        document.getElementsByClassName("contextMenu")[0].outerHTML = "";
    }
    var newelement = document.createElement("div");
    newelement.classList.add("contextMenu");
    newelement.style.left = data.system.mouse.x + "px";
    newelement.style.top = data.system.mouse.y + "px";
    document.body.append(newelement);

    for (var i = 0; content.length > i; i++) {
        newelement = document.getElementsByClassName("contextMenu")[0];
        if (content[i][0] == "<hr>") {
            var newcontextelement = document.createElement("hr");
        } else {
            var newcontextelement = document.createElement("a");
            newcontextelement.innerHTML = content[i][0];
            newcontextelement.href = "#";
            newcontextelement.setAttribute("onclick",content[i][1]);
            if (content[i][2] && content[i][2] == "disabled") {
                newcontextelement.removeAttribute("href");
                newcontextelement.setAttribute("disabled","disabled");
            }
        }
        newelement.append(newcontextelement);
    }

    newelement.parentElement.addEventListener("click", function () {
        newelement.outerHTML = "";
    })
}





var key = [];

window.addEventListener("keydown", function (event) {

    key["current"] = event.key.toLowerCase();
    if (key["current"] == "control") {
        key["control"] = true;
    } else if (key["current"] == "shift") {
        key["shift"] = true;
    } else if (key["current"] == "alt") {
        key["alt"] = true;
    } else if (key["current"] == "meta") {
        key["meta"] = true;
    } else if (key["current"] == " ") {
        key["space"] = true;
    }

    //   if(key['control'] && key['shift'] || key["current"] == "f12") {
    // } else {
    //   event.preventDefault();
    //   event.stopPropagation();
    // }

    if(key['control'] == true) {
    }

    if(key['shift'] && key['space']) {
        // if(key['current'] == "w") {
        //     if(!ismainos) {
        //         parent.unrun(data.mypid);
        //     }
        // }
    }

    if(key['alt'] == true) {
    }

    if(key['meta'] == true) {
    }
})


window.addEventListener("keyup", function (event) {
    key["current"] = event.key.toLowerCase();
    if (key["current"] == "control") {
        key["control"] = false;
    } else if (key["current"] == "shift") {
        key["shift"] = false;
    } else if (key["current"] == "alt") {
        key["alt"] = false;
    } else if (key["current"] == "meta") {
        key["meta"] = false;
    } else if (key["current"] == " ") {
        key["space"] = false;
    }
});


// Maths

function random(min, max, decimals, runs) {
    // Todo: Fix following limits:
    // min has to be at least 0 (no negative possible)
    // limited to digits of Math.random(), other digits will be 0
    // runs only runs Math.random() a defined amount of times before the final result is generated and returned. Instead previous values should be used as some sort of seed to improve randomisation

    if(min == null && max == null && decimals == null && runs == null) { // If nothing is given, assume Math.random()
        return Math.random();
    } else {


        if(min == null) { // Min default value
            min = 0;
        }

        if(max == null) { // Max default value
            max = 255
        }

        if(decimals == null) { // No decimals by default
            decimals = 0;
        }

        if(runs == null) { // Runs by default
            runs = 3;
        } else if (runs > 2 ** 16) {
            runs = 3;
            console.error("Max number of runs for random() is " + (2 ** 16) + " - Defaulting to " + runs + " runs.");
            // TODO: Add System setting for default runs and max runs
        }

        for(; 0 < runs; runs--) {
            if(runs > 1) {
                Math.random();
            } else if (runs == 1) {
                var tryRandom = (Math.random() * max).toFixed(decimals);
                while(tryRandom < min || tryRandom > max) {
                    tryRandom = (Math.random() * max).toFixed(decimals);
                }
                return tryRandom;
            }
        }
    }
}
