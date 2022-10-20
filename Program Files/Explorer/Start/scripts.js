const startMenuWindow = os.getWindowById(osWindow.pid);
function run(which) {
    os.run(which);
    close_startmenu();
}

function close_startmenu() {
    os.unrun(startMenuWindow);
}

// Spawn icons in all-programs list

const programsinfolder = os.listdir(os.path.user + "programs/");
const allProgramsContainer = document.getElementById("allprograms");

programsinfolder.forEach((item, index) => {
    let myCurrentProgram = JSON.parse(loadfile(item));

    if(myCurrentProgram.spawnicon == !1) {
        return;
    } // else:

    if(myCurrentProgram.devonly == true && parent.setting.developer == false) {
        return;
    } // else:

    if(myCurrentProgram.germantv == true && parent.setting.german_tv == false) {
        return;
    } // else:

    let myNewChildNode1 = document.createElement("a");
    let myNewChildNode2 = document.createElement("img");
    let myNewChildNode3 = document.createElement("span");

    myNewChildNode1.setAttribute("onclick", "run('" + myCurrentProgram.id + "')");
    myNewChildNode1.setAttribute("href", "#");

    myNewChildNode2.setAttribute("src", myCurrentProgram.icon);
    myNewChildNode2.setAttribute("alt", "");

    myNewChildNode3.innerText = myCurrentProgram.title

    myNewChildNode1.appendChild(myNewChildNode2); // img
    myNewChildNode1.appendChild(myNewChildNode3); // span

    allProgramsContainer.appendChild(myNewChildNode1);
})


// Set username- and icon
document.getElementById("usericon").src = "#iofs:" + os.path.sysicons + "usericons/flower.png";

window.addEventListener("keydown", function (event) {
    if(event.key.toLowerCase == "escape" || event.which == 27 ) {
        close_startmenu();
    }
});

function register() {
    if(os?.document.getElementById("taskbar")) {
        if(!os.document.getElementById("start")) {
            let startButton = document.createElement("button");
            startButton.id = "start";
            startButton.className = "has_hover";
            startButton.setAttribute("onclick", "run('explorer_start')");
            startButton.innerHTML = `
                <img src="#iofs:${os.path.sysicons}logo.svg" alt="Start">
            `;
            os.document.getElementById("taskbar").prepend(startButton);
            close_startmenu(); // Close startmenu after registering
        }
    }
}

register();