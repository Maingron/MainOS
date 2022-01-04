function show_alleprogramme() {
    document.getElementById("alleprogramme").style.overflow = "visible";
    document.getElementById("alleprogramme").style.opacity = "1";
    document.getElementById("alleprogrammeout").style.display = "inline";
}

function hide_alleprogramme() {
    document.getElementById("alleprogrammeout").style.display = "none";
    document.getElementById("alleprogramme").style = "";
}

function run(which) {
    parent.run(which);
    parent.unrun(parent.document.getElementsByClassName('explorer_start')[0].children[0].children[0]);
}

function close_startmenu() {
    parent.unrun(parent.document.getElementsByClassName('explorer_start')[0].children[0].children[0]);
}

// Spawn icons in all-programs list

var programsinfolder = listdir("C:/users/" + parent.setting.username + "/programs/");
var allProgramsContainer = document.getElementById("alleprogramme");

programsinfolder.forEach((item, index) => {
    var myCurrentProgram = JSON.parse(loadfile(item));

    if(myCurrentProgram.spawnicon == !1) {
        return;
    } // else:

    if(myCurrentProgram.devonly == true && parent.setting.developer == false) {
        return;
    } // else:

    if(myCurrentProgram.germantv == true && parent.setting.german_tv == false) {
        return;
    } // else:

    var myNewChildNode1 = document.createElement("a");
    var myNewChildNode2 = document.createElement("img");
    var myNewChildNode3 = document.createElement("span");

    myNewChildNode1.setAttribute("onclick", "run('" + myCurrentProgram.id + "')");

    myNewChildNode2.setAttribute("src", myCurrentProgram.icon);
    myNewChildNode2.setAttribute("alt", "");

    myNewChildNode3.innerText = myCurrentProgram.title

    myNewChildNode1.appendChild(myNewChildNode2); // img
    myNewChildNode1.appendChild(myNewChildNode3); // span

    allProgramsContainer.appendChild(myNewChildNode1);
})


// Set username- and icon
document.getElementById("username").innerText = parent.setting.username;

document.getElementById("usericon").children[0].src = "iofs:C:/mainos/system32/icons/usericons/flower.png";