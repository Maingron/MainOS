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

    window.alert = alert = parent.notification;




    function spawnContextMenu(content) {
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
                    newcontextelement.removeAttribute("href")
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
            if(key['current'] == "w") {
                if(!ismainos) {
                    parent.unrun(data.mypid);
                }
            }
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


data.programmeta = {};

for(var i = 0; i < document.getElementsByTagName("meta").length; i++) {
    if(document.getElementsByTagName("meta")[i] && document.getElementsByTagName("meta")[i].getAttribute("version")) {
        data.programmeta.version = document.getElementsByTagName("meta")[i].getAttribute("version");
    }
}

if(data.programmeta.version != "MainOS(host)") {
    if(!data.programmeta.version) {
        data.programmeta.version = 0;
        console.warn(parent.thisprogram.title + " doesn't have a program version in meta tags. Please add a <meta version=xx> to your <head>.");
    }

    if(!parent.thisprogram.version) {
        console.warn(parent.thisprogram.title + " doesn't have a registered program version. Please add it to the program JSON thingy.");
    }

    if(data.programmeta.version != parent.thisprogram.version) {
        console.warn(parent.thisprogram.title + "'s program version is not the expected one. (Meta:"+ data.programmeta.version + " vs. JSON: "+ parent.thisprogram.version + ")");
    }
}
