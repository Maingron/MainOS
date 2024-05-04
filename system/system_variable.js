var system = {};

if(iofs.load("/C:/system/system_variable.txt", false)) {
    system = JSON.parse(iofs.load("C:/system/system_variable.txt", false));
} else {
    initializeSystemVariable();
}

function initializeSystemVariable() {

    var newScript = document.createElement("script");
        
    // newScript.src = "system/initial_program_list.js";
    // newScript.onload = function() {
        system = returnNewSystemVariable();
        system.icons = returnIconPaths();
        system.users = [];
        system.users[0] = returnNewSysacc();

        system.users[0].paths = JSON.parse(iofs.load("C:/system/initial_program_list.json"));
        system.users[0].paths.userPath = system.paths.userRoot + system.users[0].name + "/";
        system.users[0].paths.programShortcuts = system.users[0].paths.userPath + "programs/";
        system.users[0].paths.appdata = system.users[0].paths.userPath + "appdata/";
        system.users[0].paths.logs = system.users[0].paths.userPath + "logs/";
        system.users[0].paths.temp = system.users[0].paths.userPath + "temp/";


        iofs.save(system.users[0].paths.userPath, "", "t=dir", 0);
        iofs.save(system.users[0].paths.programShortcuts, "", "t=dir", 0);
        iofs.save(system.users[0].paths.appdata, "", "t=dir", 0);

        saveSystemVariable();
    // }
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
            programs: "C:/Program Files/", // will change to C:/programs/ in the future
            icons: {
                system: "C:/system/icons/",
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
        restart: ipath + "restart.svg",
        shutdown: ipath + "shutdown.svg",
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
        programs: JSON.parse(iofs.load("C:/system/initial_program_list.json")),
        programsUntouched: JSON.parse(iofs.load("C:/system/initial_program_list.json")),
        settings: getInitialSettings()
    }
}


function getInitialSettings() {
    return {
        big_buttons: false,
        borderradius: "4px",
        default_fullscreen: false,
        developer: {
            enable: false,
            enableAllSettings: false
        },
        font: {
            fonts: "-apple-system, system-ui, 'Tahoma', 'Roboto', 'Arial', sans-serif",
            baseSize: "1em"
        },
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
        backgroundImage: "C:/users/public/photos/fluent.jpg",
        accessibility: {
            tts: {
                enabled: false
            },
            scaling: 1
        },
        taskbar: {
            showLang: true,
            showClock: true,
            showShowDesktop: true,
            showProgramTitle: false,
            height: 45, // px
            // wip
            position: "bottom"
        }
    }
}


function loginUser(name) {
    // only once document.body is loaded - temporary fix - sometimes document.body isn't loaded when browser is in background
    if(!document.body) {
        setTimeout(function() {
            loginUser(name);
        }, 100);
        return;
    }
    system.user = system.users.find(user => user.name == name);
    // create new javascript html element

    taskbar = new Taskbar();

    var newScript;

    // load script files / load scripts (system/)
    newScript = document.createElement("script");
    newScript.src = "scripts.js";
    newScript.onload = function() {
        system.runtime = systemRuntime;
    }
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
        programShortcuts: system.paths.userRoot + newUser.name + "/programs/",
        appdata: system.paths.userRoot + newUser.name + "/appdata/"
    };
    
    iofs.save(newUser.paths.userPath, "", "t=dir", 0);
    iofs.save(newUser.paths.programShortcuts, "", "t=dir", 0);
    iofs.save(newUser.paths.appdata, "", "t=dir", 0);

    system.users.push(newUser);
    saveSystemVariable();
}

function saveSystemVariable() {
    var modifiedSystemVariable = JSON.parse(JSON.stringify(system));
    modifiedSystemVariable.user = undefined;
    modifiedSystemVariable.runtime = undefined;
    for(var i = 0; i < modifiedSystemVariable.users.length; i++) {
        modifiedSystemVariable.users[i].programs = modifiedSystemVariable.users[i].programsUntouched;
    }
    // todo: add external programs file


    iofs.save("C:/system/system_variable.txt", JSON.stringify(modifiedSystemVariable), "d=0000,t=txt", 1);
}

if(system.autologin) {
    loginUser(system.autologin);
}

// loginUser("sysacc");
