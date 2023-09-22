var data = {};
data.system = {};
data.system.mouse = {};

if(ismainos) {
    var system = window.system;
} else {
    var system = window.parent.system;
}



if(ismainos != 1 && parent.ismainos == 1) {
    var setting = window.parent.setting; // Get setting variable from MainOS and make it available the same way as in MainOS itself

    // IOfs
    window.loadfile = parent.loadfile;
    window.savefile = parent.savefile;
    window.isfile = parent.isfile;
    window.deletefile = parent.deletefile;
    window.savedir = parent.savedir;
    window.isfolder = parent.isfolder;
    window.listdir = parent.listdir;
    window.getFilename = parent.getFilename;
    window.getAttributes = parent.getAttributes;
    window.getAttribute = parent.getAttribute;
    
    /* TODO:
    window.close
    window.maximize
    window.minimize */


    data.programmeta = {};

    // // Get Version
    // for(var i = 0; i < document.getElementsByTagName("meta").length; i++) { // deprecated
    //     if(document.getElementsByTagName("meta")[i] && document.getElementsByTagName("meta")[i].getAttribute("version")) {
    //         data.programmeta.version = document.getElementsByTagName("meta")[i].getAttribute("version");
    //     }
    // }

    // if(!data.programmeta.version) {
    //     data.programmeta.version = 0;
    //     console.warn("Program " + parent.thisprogram.title + " doesn't have a program version in meta tags. Please add a <meta version=xx> to your <head>.");
    // }
}

var ismainos;

function refreshCSSVars() {
    document.documentElement.style.setProperty("--themecolor", system.user.settings.themecolor);
    document.documentElement.style.setProperty("--themecolor2", system.user.settings.themecolor2);
    document.documentElement.style.setProperty("--font", system.user.settings.font.fonts);
    document.documentElement.style.setProperty("--font-size-base", system.user.settings.font.baseSize);
    document.documentElement.style.setProperty("--border-radius", system.user.settings.borderradius);
    document.documentElement.style.setProperty("--hovercolor", system.user.settings.hovercolor);
    document.documentElement.style.setProperty("--hovercolornontransparent", system.user.settings.hovercolornontransparent);
    
    
    if (system.user.settings.notsodarkmode == 1) {
        document.documentElement.style.setProperty("--black", "#151515");
        document.documentElement.style.setProperty("--black2", "#444");
        document.documentElement.style.setProperty("--black3", "#555");
        document.documentElement.style.setProperty("--black4", "#666");
        document.documentElement.style.setProperty("--black5", "#757575");
    }
}

refreshCSSVars();


window.addEventListener("load", function() {
    if (system.user.settings.big_buttons == 1) {
        document.body.classList.add("big_buttons");
    }
})

// Load iofs:*-paths that are found in HTML Elements
async function loadIOfsLinks() {
    var allElements = document.querySelectorAll("[src*='iofs:'], [href*='iofs:']");
    for(item of allElements) {
        loadIOfsLink(item);
    }
}

async function loadIOfsLink(element) {
    window.setTimeout(function() {
        if(element?.src?.includes("iofs:")) {
            element.src = loadfile(element.src.split("iofs:")[1]);
        }
        if(element?.href?.includes("iofs:")) {
            element.href = loadfile(element.href.split("iofs:")[1]);
        }
    }, 0);
}


// observe document and run when changes detected
IOfsObserver = new MutationObserver(function(mutations) {
    if(mutations[0].type == "childList") {
        loadIOfsLinks();
    } else {
        return;
    }
});


document.addEventListener("DOMContentLoaded", function() {
    IOfsObserver.observe(document, {
        attributes: true,
        childList: true,
        characterData: false,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false
    });

    loadIOfsLinks();
});


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

    for (let i = 0; content.length > i; i++) {
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



// var key = [];

// window.addEventListener("keydown", function (event) {

//     key["current"] = event.key.toLowerCase();
//     if (key["current"] == "control") {
//         key["control"] = true;
//     } else if (key["current"] == "shift") {
//         key["shift"] = true;
//     } else if (key["current"] == "alt") {
//         key["alt"] = true;
//     } else if (key["current"] == "meta" || key["current"] == "os") {
//         key["meta"] = true;
//     } else if (key["current"] == " ") {
//         key["space"] = true;
//     }

//     //   if(key['control'] && key['shift'] || key["current"] == "f12") {
//     // } else {
//     //   event.preventDefault();
//     //   event.stopPropagation();
//     // }

//     if(key['control'] == true) {
//     }

//     if(key['shift'] && key['space']) {
//         // if(key['current'] == "w") {
//         //     if(!ismainos) {
//         //         parent.unrun(data.mypid);
//         //     }
//         // }
//     }

//     if(key['alt'] == true) {
//     }

//     if(key['meta'] == true) {
//         event.preventDefault();
//         event.stopPropagation();
//         if(parent.pid.includes("start_menu")) {
//             parent.unrun(parent.getWindowByMagic(parent.document.getElementsByClassName("start_menu")[0].id));
//         } else {
//             parent.run("start_menu");
//         }
//     }
// });


// window.addEventListener("keyup", function (event) {
//     key["current"] = event.key.toLowerCase();
//     if (key["current"] == "control") {
//         key["control"] = false;
//     } else if (key["current"] == "shift") {
//         key["shift"] = false;
//     } else if (key["current"] == "alt") {
//         key["alt"] = false;
//     } else if (key["current"] == "meta" || key["current"] == "os") {
//         key["meta"] = false;
//     } else if (key["current"] == " ") {
//         key["space"] = false;
//     }
// });


// Maths

/**
 * @deprecated
 */
function random(min, max, decimals, runs) { // Deprecated
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

if(ismainos) {
    IOfsObserver.observe(document, {
        attributes: true,
        childList: true,
        characterData: false,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false
    });
}

// Load late-src scripts
// Useful if you need to access variables that are set by the system (like pWindow) right away.
// TODO: Find a better way maybe?

document.addEventListener("DOMContentLoaded", function() {
        var scriptTags = document.getElementsByTagName("script");
        for (var currentTag of scriptTags) {
            if(currentTag.getAttribute("late-src")) {
            function loadScriptWhenHelperIsDone() {
                var currentTag1 = currentTag;
                var newLoop = window.setInterval(function() {
                    if(typeof pWindow !== "undefined") {
                        currentTag1.src = currentTag1.getAttribute("late-src");
                        // destroy loop
                        window.clearInterval(newLoop);
                    }
                },100);
            }
            loadScriptWhenHelperIsDone();
        }
    }
});

// -----------------------------
// Polyfills
// -----------------------------

// replaceAll

if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function (search, replacement) {
		var target = this;
		return target.split(search).join(replacement);
	};
}