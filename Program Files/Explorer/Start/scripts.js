// if is already running, close both instances
if(parent.processList.includes("start_menu") && pWindow.getPid() != parent.processList.indexOf("start_menu")) {
    // hide this window
    pWindow.setMinimized(1);
    // get index number
    let index = parent.processList.indexOf("start_menu");
    parent.unrun(parent.getWindowById(index));
    close_startmenu();
} else {
    pWindow.setMaximized(1);
}

function run(which) {
    os.run(which);
    close_startmenu();
}

function close_startmenu() {
    pWindow.close();
}

// Spawn icons in all-programs list

const programsinfolder = os.listdir(system.user.paths.programShortcuts);
const allProgramsContainer = document.getElementById("allprograms");

programsinfolder.forEach((item, index) => {
    let myCurrentProgram = JSON.parse(loadfile(item));

    if(myCurrentProgram.spawnicon == !1) {
        return;
    } // else:

    if(myCurrentProgram.devonly == true && system.user.settings.developer.enable == false) {
        return;
    } // else:

    let myNewChildNode1 = document.createElement("a");
    let myNewChildNode2 = document.createElement("img");
    let myNewChildNode3 = document.createElement("span");

    myNewChildNode1.setAttribute("onclick", "run('" + myCurrentProgram.id + "')");
    myNewChildNode1.setAttribute("href", "#");
    myNewChildNode1.classList.add("has_hover");

    myNewChildNode2.setAttribute("src", myCurrentProgram.icon);
    myNewChildNode2.setAttribute("alt", "");

    myNewChildNode3.innerText = myCurrentProgram.title

    myNewChildNode1.appendChild(myNewChildNode2); // img
    myNewChildNode1.appendChild(myNewChildNode3); // span

    allProgramsContainer.appendChild(myNewChildNode1);
})


// Set username- and icon
document.getElementById("usericon").src = "#iofs:" + system.paths.icons.system + "usericons/guest.svg";

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
            startButton.setAttribute("onclick", "run('start_menu','','min')");
            startButton.innerHTML = `
                <img src="#iofs:${system.icons.logo}" alt="Start">
            `;
            if(system.user.settings.developer.enable) {
                startButton.innerHTML += `
                    <span style="color: red; font-weight: bold; position: absolute; top: 0; right: 1px; opacity:.75">🧑‍💻</span>
                `;
            }
            os.document.getElementById("taskbar").prepend(startButton);
            close_startmenu(); // Close startmenu after registering
        }
    }
}

register();

// Since the start menu is in autostart and run with every SUCCESSFUL start, we can tell the system once we're booted successfully.
// This allows us to have emergency buttons that get hidden once the system is booted SUCCESSFULLY. Else the user can use the emergency buttons to fix the boot process.
// Only do this once
if(!os.systemRuntime.bootSuccessful) {
    os.hideEmergencyTools();
    os.systemRuntime.bootSuccessful = true;
}
