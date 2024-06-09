document.title = "MainOS: Updating...";
document.write("<div id='iinfo' style='position:fixed; display:inline-block; top:0; left:0; height:100%; width:100%; background-color:var(--themecolor); z-index:123456789; transition:.4s;'><center><h1 style='display:inline-block;'>Updating...</h1><div id='waitingfor'></div></center></div>");

var throughIOfs = false;
var userFolderCopied = false;

var openAsyncFiles = [];

function reportOpenAsyncFiles() {
    // list all files
    var files = "";
    for (var i = 0; i < openAsyncFiles.length; i++) {
        files += openAsyncFiles[i] + "<br>";
    }
    document.getElementById("waitingfor").innerHTML = "Waiting for " + openAsyncFiles.length + " Files: <br>" + files;

    maybeReload();
}

function savefilefromurl(path, url, override, fileAttributes) {
    openAsyncFiles.push(path);
    reportOpenAsyncFiles();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(e) {
    if (this.status == 200) {
        var file = new FileReader();
        file.onload = function(event) {
            let result = event.target.result;
            let convertToTxt = ["data:application/json;base64,"];
            for(let entry of convertToTxt) {
                if(event.target.result.indexOf(entry) == 0) {
                    result = atob(event.target.result.split(entry)[1]);
                }
            }
            iofs.save(path, result, fileAttributes, override);
            openAsyncFiles.splice(openAsyncFiles.indexOf(path), 1);
            reportOpenAsyncFiles();
        }
        file.readAsDataURL(this.response);
        }
    };
    xhr.send();
}


window.onload = function(){

// Check Disk size
if (localStorage && !localStorage.getItem('size')) {
    let i = 0;
    try {
        // Test up to 10 MB
        for (i = 1000; i <= 10000; i += 1000) {
            localStorage.setItem('test', new Array((i * 1024) + 1).join('a'));
        }
    } catch (e) {
        localStorage.removeItem('test');

        iofs.save("C:/.diskinfo/size.txt", i - 1000, 0, "t=txt");
    }
}


const i = { // installation vars
    "un": "default", // username
    "up": "C:/users/" + "default" + "/", // user path of current user
    "ups": "C:/users/" + "default" + "/settings/", // user path / settings
    "i": "C:/system/icons/", // icon path
    "iu": "C:/system/icons/usericons/" // usericons
}

const bulkDirs = [
    ["C:"],
    ["D:"],
    ["C:/system", "A=0"],
    ["C:/.diskinfo", "A=0"],
    ["C:/mainos", "A=0"],
    ["C:/mainos/system32", "A=0!"],
    ["C:/Program Files/"],
    ["C:/mainos/system32/settings/", "A=!", 1],
    "C:/users",
    "C:/users/default",
    "C:/users/default/Program Data",
    "C:/users/default/appdata",
    ["C:/users/default/temp", "A=a"],
    "C:/users/default/settings",
    "C:/users/default/books",
    "C:/users/default/music",
    "C:/users/default/photos",
    "C:/Program Files/cmd",
    "C:/Program Files/colors",
    "C:/Program Files/excel",
    "C:/Program Files/notepad",
    "C:/Program Files/pixels",
    "C:/Program Files/Dont Tag Me",
    "C:/Program Files/Optisocubes",
    "C:/Program Files/notifications",
    "C:/Program Files/Simple Cookieclicker",
    "C:/Program Files/hype",
    "C:/Program Files/settings",
    "C:/Program Files/taskmanager",
    "C:/Program Files/paint",
    "C:/Program Files/evalculator",
    "C:/Program Files/browser",
    "C:/Program Files/run",
    "C:/users/default/programs",
    "C:/system/icons",
    "C:/system/icons/usericons"

];

for(let dir of bulkDirs) {
    if(typeof(dir) == "object") {
        iofs.save(dir[0], "", "t=d," + (dir[1] || ""), (dir[2] || 0));
    } else {
        iofs.save(dir, "", "t=d");
    }
}

const bulkFiles = [
    ["C:/test.txt", "test", "t=txt,A=ABCDEF0!", 1],
    ["C:/mainos/system32/FirstVersion.txt", "###### mainos.version", "t=txt,A=0a!"],
    ["C:/mainos/system32/FirstVersionnr.txt", "###### mainos.versionnr", "t=txt,A=0a!"],
    ["C:/users/default/wallpapers.txt", "Links to wallpapers to use as background image for MainOS\n\nWallpapers made by Michael Gillett (https://twitter.com/MichaelGillett):\n https://maingron.com/things/wp/michael_gillett/fluent.jpg\n https://maingron.com/things/wp/michael_gillett/andromeda.jpg\n https://maingron.com/things/wp/michael_gillett/bliss-night.jpg\n https://maingron.com/things/wp/michael_gillett/clippy-x-rex.jpg (modified by Maingron)\n https://maingron.com/things/wp/michael_gillett/polaris.jpg", "t=txt"],
    ["C:/users/default/Credits.txt", "MainOS Credits:MainOS Credits:\n\nMainOS is a one-man project, though some people contributed to it or gave financial support. Special thanks to:\n\nDerry Shribman | https://lif.zone/team#derry\nDavid King - Optisocubes | https://twitter.com/dr_d_king\nMichael Gillett - Wallpapers | https://twitter.com/MichaelGillett", "t=txt"],
    ["C:/users/default/More Programs.txt", "If you want more programs, open cmd and type 'setting repository 1'. Afterwards restart MainOS.", "t=txt"],
    ["C:/users/default/books/pi.txt", Math.PI, "t=txt"],
    ["C:/users/default/books/Lorem Ipsum.txt", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligula. Fusce fermentum. Nullam cursus lacinia erat. Praesent blandit laoreet nibh. Fusce convallis metus id felis luctus adipiscing. Pellentesque egestas, neque sit amet convallis pulvinar, justo nulla eleifend augue, ac auctor orci leo non est. Quisque id mi. Ut tincidunt tincidunt erat. Etiam feugiat lorem non metus. Vestibulum dapibus nunc ac augue. Curabitur vestibulum aliquam leo. Praesent egestas neque eu enim. In hac habitasse platea dictumst. Fusce a quam. Etiam ut purus mattis mauris sodales aliquam. Curabitur nisi. Quisque malesuada placerat nisl. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Sed augue ipsum, egestas nec, vestibulum et, malesuada adipiscing, dui. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Mauris sollicitudin fermentum libero. Praesent nonummy mi in odio. Nunc interdum lacus sit amet orci. Vestibulum rutrum, mi nec elementum vehicula, eros quam gravida nisl, id fringilla neque ante vel mi. Morbi mollis tellus ac sapien. Phasellus volutpat, metus eget egestas mollis, lacus lacus blandit dui, id egestas quam mauris ut lacus. Fusce vel dui. Sed in libero ut nibh placerat accumsan. Proin faucibus arcu quis ante. In consectetuer turpis ut velit. Nulla sit amet est. Praesent metus tellus, elementum eu, semper a, adipiscing nec, purus. Cras risus ipsum, faucibus ut, ullamcorper id, varius ac, leo. Suspendisse feugiat. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi. Praesent nec nisl a purus blandit viverra. Praesent ac massa at ligula laoreet iaculis. Nulla neque dolor, sagittis eget, iaculis quis, molestie non, velit. Mauris turpis nunc, blandit et, volutpat molestie, porta ut, ligula. Fusce pharetra convallis urna. Quisque ut nisi. Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Suspendisse non nisl sit amet velit hendrerit rutrum. Ut leo. Ut a nisl id ante tempus hendrerit. Proin pretium, leo ac pellentesque mollis, felis nunc ultrices eros, sed gravida augue augue mollis justo. Suspendisse eu ligula. Nulla facilisi. Donec id justo. Praesent porttitor, nulla vitae posuere iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum. Curabitur suscipit suscipit tellus. Praesent vestibulum dapibus nibh. Etiam iaculis nunc ac metus. Ut id nisl quis enim dignissim sagittis. Etiam sollicitudin, ipsum eu pulvinar rutrum, tellus ipsum laoreet sapien, quis venenatis ante odio sit amet eros. Proin magna. Duis vel nibh at velit scelerisque suscipit. Curabitur turpis. Vestibulum suscipit nulla quis orci. Fusce ac felis sit amet ligula pharetra condimentum. Maecenas egestas arcu quis ligula mattis placerat. Duis lobortis massa imperdiet quam. Suspendisse potenti. Pellentesque commodo eros a enim. Vestibulum turpis sem, aliquet eget, lobortis pellentesque, rutrum eu, nisl. Sed libero. Aliquam erat volutpat. Etiam vitae tortor. Morbi vestibulum volutpat enim. Aliquam eu nunc. Nunc sed turpis. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Nulla porta dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Pellentesque dapibus hendrerit tortor. Praesent egestas tristique nibh. Sed a libero. Cras varius. Donec vitae orci sed dolor rutrum auctor. Fusce egestas elit eget lorem. Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget, diam. Nam at tortor in tellus interdum sagittis. Aliquam lobortis. Donec orci lectus, aliquam ut, faucibus non, euismod id, nulla. Curabitur blandit mollis lacus. Nam adipiscing. Vestibulum eu odio. Vivamus laoreet. Nullam tincidunt adipiscing enim. Phasellus tempus. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. Fusce neque. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Vivamus aliquet elit ac nisl. Fusce fermentum odio nec arcu. Vivamus euismod mauris. In ut quam vitae odio lacinia tincidunt. Praesent ut ligula non mi varius sagittis. Cras sagittis. Praesent ac sem eget est egestas volutpat. Vivamus consectetuer hendrerit lacus. Cras non dolor. Vivamus in erat ut urna cursus vestibulum. Fusce commodo aliquam arcu. Nam commodo suscipit quam. Quisque id odio. Praesent venenatis metus at tortor pulvinar varius.", "t=txt"],
    ["C:/Program Files/info.txt", "Not all files of programs are listed here / within iofs. This directory probably won't behave as you'd expect.", "t=txt"],
    ["C:/mainos/customprograms.txt", "{}", "t=txt"],
    ["C:/mainos/system32/ExpectedVersion.txt", "###### mainos.version", "t=txt"],
    ["C:/mainos/system32/ExpectedVersionnr.txt", "###### mainos.versionnr", "t=txt"]
];

for(let file of bulkFiles) {
    iofs.save(file[0], (file[1] || ""), (file[2] || ""), (file[3] || 0));
}

const bulkFilesExt = [
    ["C:/users/default/photos/fluent.jpg", "users/default/photos/fluent.jpg","t=jpg"],
    ["C:/users/default/photos/Maingron 1024x.png", "users/default/photos/Maingron 1024x.png", "t=png"],
    ["C:/Program Files/cmd/icon.png", "Program Files/cmd/icon.png", "t=png"],
    ["C:/Program Files/colors/icon.svg", "Program Files/colors/icon.svg", "t=svg"],
    ["C:/Program Files/excel/icon.svg", "Program Files/excel/icon.svg", "t=svg"],
    ["C:/Program Files/notepad/icon.png", "Program Files/notepad/icon.png", "t=png"],
    ["C:/Program Files/pixels/icon.svg", "Program Files/pixels/icon.svg","t=svg"],
    ["C:/Program Files/Dont Tag Me/icon.svg", "Program Files/Dont Tag Me/icon.svg", "t=svg"],
    ["C:/Program Files/Optisocubes/icon.svg", "Program Files/Optisocubes/icon.svg", "t=svg"],
    ["C:/Program Files/notifications/icon.png", "Program Files/notifications/icon.png", "t=png"],
    ["C:/Program Files/Simple Cookieclicker/icon.png", "Program Files/Simple Cookieclicker/icon.png", 0, "t=png"],
    ["C:/Program Files/hype/icon.png", "Program Files/hype/icon.png", "t=png"],
    ["C:/Program Files/settings/icon.svg", "Program Files/settings/icon.svg", "t=svg"],
    ["C:/Program Files/taskmanager/icon.svg","Program Files/taskmanager/icon.svg", "t=svg"],
    ["C:/Program Files/paint/icon.svg", "Program Files/paint/icon.svg", "t=svg"],
    ["C:/Program Files/evalculator/icon.png", "Program Files/evalculator/icon.png", "t=png"],
    ["C:/Program Files/browser/icon.png", "Program Files/browser/icon.png", "t=png"],
    ["C:/Program Files/run/icon.png", "Program Files/run/icon.png", "t=png"],
    ["C:/system/initial_program_list.json", "system/initial_program_list.json", "t=txt"],
    ["C:/system/icons/usericons/guest.svg", "system/icons/usericons/guest.svg", "t=svg"],
    ["C:/system/icons/logo.svg", "img/logo.svg", "t=svg,A=0", 1],
    ["C:/system/icons/unknown_file.svg", "system/icons/unknown_file.svg", "t=svg"],
    ["C:/system/icons/transparent.png", "img/transparent.png", "t=png"],
    ["C:/system/icons/shutdown.svg", "system/icons/shutdown.svg", "t=svg"],
    ["C:/system/icons/restart.svg", "system/icons/restart.svg", "t=svg"],
    ["C:/system/icons/logoff.png", "system/icons/logoff.png", "t=png"],
    ["C:/system/icons/all programs.svg", "system/icons/all programs.svg", "t=svg"],
    ["C:/system/icons/arrow1.svg", "system/icons/arrow1.svg", "t=svg"],
    ["C:/system/icons/folder.svg", "system/icons/folder.svg", "t=svg"],
    ["C:/system/icons/folder_up.svg", "system/icons/folder_up.svg", "t=svg"],
    ["C:/system/icons/folder_search.svg", "system/icons/folder_search.svg", "t=svg"],
    ["C:/system/icons/mainos_folder.svg", "system/icons/mainos_folder.svg", "t=svg"],
    ["C:/system/icons/fullscreen.svg", "system/icons/fullscreen.svg", "t=svg"]

];

for(let file of bulkFilesExt) {
    openAsyncFiles.push(file[0]);
    reportOpenAsyncFiles();
    iofs.loadExternal(file[1], function(content = undefined, attributes = file[2], path = file[0], override = file[3] ?? false) {installExtCallback(path, content, attributes, override, false, true)});
}


function installExtCallback(path, content, attributes, override, recursive, isRaw) {
    iofs.save(path, content, attributes, override, recursive, isRaw)
    openAsyncFiles.splice(openAsyncFiles.indexOf(path), 1);
    reportOpenAsyncFiles();
}

function copyWhenDone() {
    if(openAsyncFiles.length > 0) {
        window.setInterval(function() {
            copyWhenDone();
        }, 500);
    } else {
        initializeSystemVariable();
        createNewUser("public");
        createNewUser("sysacc");
        userFolderCopied = true;

        iofs.save("C:/users/default", "", "t=dir,A=a",true);
        throughIOfs = true;
        maybeReload();
    }
}

copyWhenDone();

var program = JSON.parse(iofs.load("C:/system/initial_program_list.json"));
var programs = JSON.parse(iofs.load("C:/system/initial_program_list.json"));

// Dynamic settings (import from user's machine)
if(navigator.language == "en") {
    var initLang = "en"
} else if(navigator.language == "de") {
    var initLang = "de"
} else {
    var initLang = "en"
}
// savefile(i.ups + "language.txt", initLang, 0, "t=txt,A=!");

// Append some attributes
// setAttribute("C:/users/default/", "A", getAttribute("C:/users/default/", "A") + "0a");
};

function maybeReload() {
    if (throughIOfs && openAsyncFiles.length == 0 && userFolderCopied == true) {
        location.reload();
    }
}
