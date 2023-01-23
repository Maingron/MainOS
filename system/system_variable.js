var system = {};

if(loadfile("C:/system/system_variable.txt", false)) {
    system = JSON.parse(loadfile("C:/system/system_variable.txt", false));
} else {
    initializeSystemVariable();
}

function initializeSystemVariable() {

    var newScript = document.createElement("script");
    newScript.src = "system/initial_program_list.js";
    newScript.onload = function() {
        system = returnNewSystemVariable();
        system.icons = returnIconPaths();
        system.users = [];
        system.users[0] = returnNewSysacc();

        system.users[0].paths = {};
        system.users[0].paths.userPath = system.paths.userRoot + system.users[0].name + "/";
        system.users[0].paths.programShortcuts = system.users[0].paths.userPath + "programs/";

        savedir(system.users[0].paths.userPath);
        savedir(system.users[0].paths.programShortcuts);

        saveSystemVariable();
    }
    document.head.prepend(newScript);


}

function returnNewSystemVariable() {
    return {
        osDetails: {
            name: "MainOS",
            version: 180,
            creator: "Maingron",
            copyright: "Maingron 2018 - 2023",
            license: "",
            serverpath: "https://maingron.com",
            serverroot: "https://maingron.com/projects/MainOS/server",
            serverrepository: "https://maingron.com/projects/MainOS/server/repository.json",
        },
        hostOS: {
            languages: navigator.languages,
            prefersDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches
        },
        paths: {
            systemDrive: "C:/",
            systemRoot: "C:/" + "mainos/",
            userRoot: "C:/" + "users/",
            icons: {
                system: "C:/mainos/system32/icons/",
            }
        },
        icons: {},
        autologin: "sysacc"
    }
}

function returnIconPaths() {
    let ipath = system.paths.icons.system;
    return {
        all_programs: ipath + "all programs.svg",
        arrow1: ipath + "arrow1.svg",
        folder: ipath + "folder.svg",
        folder_search: ipath + "folder_search.svg",
        folder_up: ipath + "folder_up.svg",
        fullscreen: ipath + "fullscreen.svg",
        logo: ipath + "logo.svg",
        logoff: ipath + "logoff.png",
        mainos_folder: ipath + "mainos_folder.svg",
        pc: ipath + "pc.png",
        restart: ipath + "restart.png",
        shutdown: ipath + "shutdown.png",
        transparent: ipath + "transparent.png",
        unknown_file: ipath + "unknown_file.svg"
    }
}


function returnNewSysacc() {
    return {
        name: "sysacc",
        person: {
            fullName: undefined,
            dateOfBirth: undefined,
            gender: undefined
        },
        programs: getInitialProgramList(),
        programsUntouched: getInitialProgramList(),
        settings: getInitialSettings()
    }
}


function getInitialSettings() {
    return {
        big_buttons: false,
        borderradius: "2px",
        default_fullscreen: false,
        developer: {
            enable: false,
            enableAllSettings: false
        },
        font: "-apple-system, system-ui, 'Tahoma', 'Roboto', 'Arial', sans-serif",
        german_tv: false,
        hovercolor: "#ffaa0077",
        hovercolornontransparent: "#ffaa00",
        hoveropacity: .5,
        language: "en",
        notsodarkmode: false,
        enableRepository: true,
        theme: "default",
        themecolor: "#994400",
        themecolor2: "#dd6600",
        prefersDarkMode: system.hostOS.prefersDarkMode,
        backgroundImage: "C:/Documents and Settings/Images/fluent.jpg",
        accessibility: {
            tts: {
                enabled: false
            },
            scaling: 1
        }
    }
}


function loginUser(name) {
    system.user = system.users.find(user => user.name == name);
    // create new javascript html element
    var newScript = document.createElement("script");
    newScript.src = "scripts.js";
    document.body.appendChild(newScript);

    newScript = document.createElement("script");
    newScript.src = "functions-programs.js";
    document.body.appendChild(newScript);

    newScript = document.createElement("script");
    newScript.src = "helper.js";
    document.body.appendChild(newScript);

}

function getUser(name) {
    return system.users.find(user => user.name == name);
}

function selectUser(name) {
    return system.users.find(user => user.name == name)
}

function createNewUser(name) {
    let newUser = JSON.parse(JSON.stringify(system.users[0]));
    newUser.name = name;
    newUser.paths = {
        userPath: system.paths.userRoot + newUser.name + "/",
        programShortcuts: system.paths.userRoot + newUser.name + "/programs/"
    };
    
    savedir(newUser.paths.userPath);
    savedir(newUser.paths.programShortcuts);

    system.users.push(newUser);
    saveSystemVariable();
}

function saveSystemVariable() {
    var modifiedSystemVariable = JSON.parse(JSON.stringify(system));
    modifiedSystemVariable.user = undefined;
    for(var i = 0; i < modifiedSystemVariable.users.length; i++) {
        modifiedSystemVariable.users[i].programs = modifiedSystemVariable.users[i].programsUntouched;
    }
    // todo: add external programs file


    savefile("C:/system/system_variable.txt", JSON.stringify(modifiedSystemVariable), 1, "d=0000,t=txt");
}

if(system.autologin) {
    loginUser(system.autologin);
}

// loginUser("sysacc");