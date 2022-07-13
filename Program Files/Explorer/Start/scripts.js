function run(which) {
    parent.run(which);
    close_startmenu();
}

function close_startmenu() {
    parent.unrun(parent.getWindowByMagic(this));
}

// Spawn icons in all-programs list

var programsinfolder = listdir("C:/users/" + parent.setting.username + "/programs/");
var allProgramsContainer = document.getElementById("left");

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
document.getElementById("usericon").src = "iofs:C:/mainos/system32/icons/usericons/flower.png";

window.addEventListener("keydown", function (event) {
    if(event.key.toLowerCase == "escape" || event.which == 27 ) {
        close_startmenu();
    }
});
