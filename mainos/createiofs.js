document.title = "MainOS: Updating...";
document.write("<div id='iinfo' style='position:fixed; display:inline-block; top:0; left:0; height:100%; width:100%; background-color:var(--themecolor); z-index:123456789; transition:.4s;'><center><h1 style='display:inline-block;'>Updating...</h1><div id='waitingfor'></div></center></div>");

var throughIOfs = false;
var userFolderCopied = false;

function fixfs() {
    for(myEntry of Object.keys(localStorage)) {
        if(localStorage.getItem(myEntry).indexOf("***") > -1) {
            if(isfolder(myEntry)) {
                deletefile(myEntry);
                savedir(myEntry);
                console.log(myEntry);
            } else {
                savefile(myEntry, localStorage.getItem(myEntry).split("***")[1], 1, loadfile(myEntry, 1));
            }
        }
    }
}

var openAsyncFiles = [];

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
            savefile(path, event.target.result, override, fileAttributes);
            openAsyncFiles.splice(openAsyncFiles.indexOf(path), 1);
            reportOpenAsyncFiles();
        }
        file.readAsDataURL(this.response);
        }
    };
    xhr.send();
}

function reportOpenAsyncFiles() {
    // list all files
    var files = "";
    for (var i = 0; i < openAsyncFiles.length; i++) {
        files += openAsyncFiles[i] + "<br>";
    }
    document.getElementById("waitingfor").innerHTML = "Waiting for " + openAsyncFiles.length + " Files: <br>" + files;

    maybeReload();
}


window.onload = function(){

fixfs();


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

        savefile("C:/.diskinfo/size.txt", i - 1000, 0, "t=txt");
    }
}


const i = { // installation vars
    "un": "sysacc", // username
    "up": "C:/users/" + "sysacc" + "/", // user path of current user
    "ups": "C:/users/" + "sysacc" + "/settings/", // user path / settings
    "i": "C:/system/icons/", // icon path
    "iu": "C:/system/icons/usericons/" // usericons
}


savedir("C:/system/",1,"A=0");

savedir("C:/.diskinfo/",1,"A=0");

savedir("C:/");

savefile("C:/test.txt", "test", 0, "t=txt,A=ABCDEF0!");
savedir("D:/");
savedir("C:/users/");
savedir("C:/mainos/",1,"A=0");

savedir("C:/mainos/system32/",1,"A=0!");

savefile("C:/mainos/system32/FirstVersion.txt", mainos.version, 0, "t=txt,A=0a!");
savefile("C:/mainos/system32/FirstVersionnr.txt", mainos.versionnr, 0, "t=txt,A=0a!");

savedir("C:/Program Files/");

savedir("C:/mainos/system32/settings/",1,"A=!");

// if (setting.username != "User") {
//     savefile("C:/mainos/system32/settings/username.txt", "User", 0, "t=txt");
//     setting.username = "User";
// }

savedir("C:/users/");

savedir("C:/users/default/");




savedir("C:/users/default/Program Data/");
savedir("C:/users/default/appdata/");
savedir("C:/users/default/temp/",0,"A=a");
savedir("C:/users/default/settings/");

savefile("C:/users/default/wallpapers.txt", "Links to wallpapers to use as background image for MainOS\n\nWallpapers made by Michael Gillett (https://twitter.com/MichaelGillett):\n https://maingron.com/things/wp/michael_gillett/fluent.jpg\n https://maingron.com/things/wp/michael_gillett/andromeda.jpg\n https://maingron.com/things/wp/michael_gillett/bliss-night.jpg\n https://maingron.com/things/wp/michael_gillett/clippy-x-rex.jpg (modified by Maingron)\n https://maingron.com/things/wp/michael_gillett/polaris.jpg", 0, "t=txt");

savefile("C:/users/default/Credits.txt", "MainOS Credits:MainOS Credits:\n\nMainOS is a one-man project, though some people contributed to it or gave financial support. Special thanks to:\n\nDerry Shribman | https://lif.zone/team#derry\nDavid King - Optisocubes | https://twitter.com/dr_d_king\nMichael Gillett - Wallpapers | https://twitter.com/MichaelGillett", 1, "t=txt");

savefile("C:/users/default/More Programs.txt", "If you want more programs, open cmd and type 'setting repository 1'. Afterwards restart MainOS.", 0, "t=txt");



savedir("C:/users/default/Books/");

savefile("C:/users/default/Books/pi.txt", Math.PI, 0, "t=txt");

savefile("C:/users/default/Books/Lorem Ipsum.txt", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligula. Fusce fermentum. Nullam cursus lacinia erat. Praesent blandit laoreet nibh. Fusce convallis metus id felis luctus adipiscing. Pellentesque egestas, neque sit amet convallis pulvinar, justo nulla eleifend augue, ac auctor orci leo non est. Quisque id mi. Ut tincidunt tincidunt erat. Etiam feugiat lorem non metus. Vestibulum dapibus nunc ac augue. Curabitur vestibulum aliquam leo. Praesent egestas neque eu enim. In hac habitasse platea dictumst. Fusce a quam. Etiam ut purus mattis mauris sodales aliquam. Curabitur nisi. Quisque malesuada placerat nisl. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Sed augue ipsum, egestas nec, vestibulum et, malesuada adipiscing, dui. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Mauris sollicitudin fermentum libero. Praesent nonummy mi in odio. Nunc interdum lacus sit amet orci. Vestibulum rutrum, mi nec elementum vehicula, eros quam gravida nisl, id fringilla neque ante vel mi. Morbi mollis tellus ac sapien. Phasellus volutpat, metus eget egestas mollis, lacus lacus blandit dui, id egestas quam mauris ut lacus. Fusce vel dui. Sed in libero ut nibh placerat accumsan. Proin faucibus arcu quis ante. In consectetuer turpis ut velit. Nulla sit amet est. Praesent metus tellus, elementum eu, semper a, adipiscing nec, purus. Cras risus ipsum, faucibus ut, ullamcorper id, varius ac, leo. Suspendisse feugiat. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi. Praesent nec nisl a purus blandit viverra. Praesent ac massa at ligula laoreet iaculis. Nulla neque dolor, sagittis eget, iaculis quis, molestie non, velit. Mauris turpis nunc, blandit et, volutpat molestie, porta ut, ligula. Fusce pharetra convallis urna. Quisque ut nisi. Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Suspendisse non nisl sit amet velit hendrerit rutrum. Ut leo. Ut a nisl id ante tempus hendrerit. Proin pretium, leo ac pellentesque mollis, felis nunc ultrices eros, sed gravida augue augue mollis justo. Suspendisse eu ligula. Nulla facilisi. Donec id justo. Praesent porttitor, nulla vitae posuere iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum. Curabitur suscipit suscipit tellus. Praesent vestibulum dapibus nibh. Etiam iaculis nunc ac metus. Ut id nisl quis enim dignissim sagittis. Etiam sollicitudin, ipsum eu pulvinar rutrum, tellus ipsum laoreet sapien, quis venenatis ante odio sit amet eros. Proin magna. Duis vel nibh at velit scelerisque suscipit. Curabitur turpis. Vestibulum suscipit nulla quis orci. Fusce ac felis sit amet ligula pharetra condimentum. Maecenas egestas arcu quis ligula mattis placerat. Duis lobortis massa imperdiet quam. Suspendisse potenti. Pellentesque commodo eros a enim. Vestibulum turpis sem, aliquet eget, lobortis pellentesque, rutrum eu, nisl. Sed libero. Aliquam erat volutpat. Etiam vitae tortor. Morbi vestibulum volutpat enim. Aliquam eu nunc. Nunc sed turpis. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Nulla porta dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Pellentesque dapibus hendrerit tortor. Praesent egestas tristique nibh. Sed a libero. Cras varius. Donec vitae orci sed dolor rutrum auctor. Fusce egestas elit eget lorem. Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget, diam. Nam at tortor in tellus interdum sagittis. Aliquam lobortis. Donec orci lectus, aliquam ut, faucibus non, euismod id, nulla. Curabitur blandit mollis lacus. Nam adipiscing. Vestibulum eu odio. Vivamus laoreet. Nullam tincidunt adipiscing enim. Phasellus tempus. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. Fusce neque. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Vivamus aliquet elit ac nisl. Fusce fermentum odio nec arcu. Vivamus euismod mauris. In ut quam vitae odio lacinia tincidunt. Praesent ut ligula non mi varius sagittis. Cras sagittis. Praesent ac sem eget est egestas volutpat. Vivamus consectetuer hendrerit lacus. Cras non dolor. Vivamus in erat ut urna cursus vestibulum. Fusce commodo aliquam arcu. Nam commodo suscipit quam. Quisque id odio. Praesent venenatis metus at tortor pulvinar varius.", 0, "t=txt");

savefile("C:/users/default/Books/Wiki Windows XP.txt", "Windows XP is a personal computer operating system produced by Microsoft as part of the Windows NT family of operating systems. It was released to manufacturing on August 24, 2001, and broadly released for retail sale on October 25, 2001.\n\n\nDevelopment of Windows XP began in the late 1990s as \"Neptune\", an operating system (OS) built on the Windows NT kernel which was intended specifically for mainstream consumer use. An updated version of Windows 2000 was also originally planned for the business market; however, in January 2000, both projects were scrapped in favor of a single OS codenamed \"Whistler\", which would serve as a single OS platform for both consumer and business markets. As such, Windows XP was the first consumer edition of Windows not to be based on MS-DOS.\n\nUpon its release, Windows XP received generally positive reviews, with critics noting increased performance and stability (especially in comparison to Windows ME, the previous Windows operating system), a more intuitive user interface, improved hardware support, and expanded multimedia capabilities. However, some industry reviewers were concerned by the new licensing model and product activation system.\n\nExtended support for Windows XP ended on April 8, 2014, after which the operating system ceased receiving further support or security updates to most users. As of January 2019, 2.18% of Windows PCs run Windows XP, and the OS is still popular in some countries with up to 28% of the Windows share. \n\n\nIn the late 1990s, initial development of what would become Windows XP was focused on two individual products; \"Odyssey\", which was reportedly intended to succeed the future Windows 2000, and \"Neptune\", which was reportedly a consumer-oriented operating system using the Windows NT architecture, succeeding the MS-DOS-based Windows 98.\n\nHowever, the projects proved to be too ambitious. In January 2000, shortly prior to the official release of Windows 2000, technology writer Paul Thurrott reported that Microsoft had shelved both Neptune and Odyssey in favor of a new product codenamed \"Whistler\", after Whistler, British Columbia, as many Microsoft employees skied at the Whistler-Blackcomb ski resort. The goal of Whistler was to unify both the consumer and business-oriented Windows lines under a single, Windows NT platform: Thurrott stated that Neptune had become \"a black hole when all the features that were cut from [Windows ME] were simply re-tagged as Neptune features. And since Neptune and Odyssey would be based on the same code-base anyway, it made sense to combine them into a single project\".\n\nAt PDC on July 13, 2000, Microsoft announced that Whistler would be released during the second half of 2001, and also unveiled the first preview build, 2250. The build notably introduced an early version of Windows XP's visual styles system.\n\nMicrosoft released the first beta build of Whistler, build 2296, on October 31, 2000. Subsequent builds gradually introduced features that users of the release version of Windows XP would recognise, such as Internet Explorer 6.0, the Microsoft Product Activation system and the Bliss desktop background.\nOn February 5, 2001, Microsoft officially announced that Whistler would be known as Windows XP, where XP stands for \"eXPerience\".", 0, "t=txt,A=!");

savedir("C:/users/default/Music/");

savedir("C:/users/default/Images/");

savefile("C:/users/default/Images/Maingron 64x64.png", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURf//AFX/Vf8AAHcRAJAL558AAAArSURBVHjaY0CA/2AwkAIIMKAC/5EpkgWoB0JDYfQACmCCUbAKCgZKYBABAJBYjMk0pGRDAAAAAElFTkSuQmCC", 0, "t=png");
savefile("C:/users/default/Images/Maingron 32x32.png", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURf//AFX/Vf8AAHcRAJAL558AAAAqSURBVHjaYwCD////42NAAX4GPxD//8AAZ2ADrAEgjI9BRbAKCAgwCAMA0gkjM3wqnRkAAAAASUVORK5CYII=", 0, "t=png");
savefile("C:/users/default/Images/Maingron 512x512.png", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAgMAAACJFjxpAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURf//AFX/Vf8AAHcRAJAL558AAADuSURBVHja7c7FAQIBEAAxmqRJiuTc3TXzXsln64KZAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwPMBYAAAAAAAAAAAAAAAAAAAAAAMB9AAAAAAAAAAAAAAAAAABBVs/CZnvXBQAAAAAAAAAAAAAAAAAAAEiSJEmSJH0bbb8PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcHWAJEmSJEmSJEmSJEmSJEmSJEmSJEmSJElS3m9lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJcHSJIkSZIkSZIkSZIkhQi5NA7cqX6gAAAAAElFTkSuQmCC", 0, "t=png");

savefilefromurl("C:/users/default/Images/fluent.jpg", "users/default/Images/fluent.jpg", 0, "t=jpg");


savefile("C:/Program Files/info.txt", "Not all files of programs are listed here / within iofs. This directory probably won't behave as you'd expect.", 0, "t=txt");


savedir("C:/Program Files/cmd/");
savefilefromurl("C:/Program Files/cmd/icon.png", "Program Files/cmd/icon.png", 0, "t=png");

savedir("C:/Program Files/colors/");
savefilefromurl("C:/Program Files/colors/icon.svg", "Program Files/colors/icon.svg", 0, "t=svg");

savedir("C:/Program Files/excel/");
savefilefromurl("C:/Program Files/excel/icon.svg", "Program Files/excel/icon.svg", 0, "t=svg");



savedir("C:/Program Files/notepad/");
savefilefromurl("C:/Program Files/notepad/icon.png", "Program Files/notepad/icon.png", 0, "t=png");



savedir("C:/Program Files/pixels/");
savefilefromurl("C:/Program Files/pixels/icon.svg", "Program Files/pixels/icon.svg", 0, "t=svg");



savedir("C:/Program Files/Dont Tag Me/");
savefilefromurl("C:/Program Files/Dont Tag Me/icon.svg", "Program Files/Dont Tag Me/icon.svg", 0, "t=svg");

savedir("C:/Program Files/Optisocubes/");
savefilefromurl("C:/Program Files/Optisocubes/icon.svg", "Program Files/Optisocubes/icon.svg", 0, "t=svg");

savedir("C:/Program Files/notifications/");
savefilefromurl("C:/Program Files/notifications/icon.png", "Program Files/notifications/icon.png", 0, "t=png");

savedir("C:/Program Files/Simple Cookieclicker/");
savefilefromurl("C:/Program Files/Simple Cookieclicker/icon.png", "Program Files/Simple Cookieclicker/icon.png", 0, "t=png");

savedir("C:/Program Files/hype/");
savefilefromurl("C:/Program Files/hype/icon.png", "Program Files/hype/icon.png", 0, "t=png");

savedir("C:/Program Files/settings/");
savefilefromurl("C:/Program Files/settings/icon.svg", "Program Files/settings/icon.svg", 0, "t=svg");

savedir("C:/Program Files/taskmanager/");
savefilefromurl("C:/Program Files/taskmanager/icon.svg","Program Files/taskmanager/icon.svg", 0, "t=svg");


savedir("C:/Program Files/paint/");
savefilefromurl("C:/Program Files/paint/icon.svg", "Program Files/paint/icon.svg", 0, "t=svg");

savedir("C:/Program Files/evalculator/");
savefilefromurl("C:/Program Files/evalculator/icon.png", "Program Files/evalculator/icon.png", 0, "t=png");

savedir("C:/Program Files/browser/");
savefilefromurl("C:/Program Files/browser/icon.png", "Program Files/browser/icon.png", 0, "t=png");


savedir("C:/Program Files/run/");
savefilefromurl("C:/Program Files/run/icon.png", "Program Files/run/icon.png", 0, "t=png");


var program = {};




savedir("C:/users/" + setting.username + "/programs/");

savefile("C:/mainos/programs.dat", JSON.stringify(program), 1, "t=txt,A=0");

savefile("C:/mainos/customprograms.txt", "{}", 0, "t=txt");

savefile("C:/mainos/system32/ExpectedVersion.txt", mainos.version, 1, "t=txt");
savefile("C:/mainos/system32/ExpectedVersionnr.txt", mainos.versionnr, 1, "t=txt");


savedir(i.i);

savefilefromurl(i.i + "logo.svg", "img/logo.svg", 1, "t=svg,A=0");



savefilefromurl(i.i + "unknown_file.svg", "system/icons/unknown_file.svg", 0, "t=svg");

savefilefromurl(i.i + "transparent.png", "img/transparent.png", 1, "t=png");

savefilefromurl(i.i + "shutdown.svg", "system/icons/shutdown.svg", 0, "t=svg");

savefilefromurl(i.i + "restart.svg", "system/icons/restart.svg", 0, "t=svg");

savefilefromurl(i.i + "logoff.png", "system/icons/logoff.png", 0, "t=png");

savefilefromurl(i.i + "all programs.svg", "system/icons/all programs.svg", 0, "t=svg");



savedir(i.iu);

savefilefromurl(i.iu + "guest.svg", "system/icons/usericons/guest.svg", 0, "t=svg");

savefilefromurl(i.i + "arrow1.svg", "system/icons/arrow1.svg", 0, "t=svg");

savefilefromurl(i.i + "folder.svg", "system/icons/folder.svg", 0, "t=svg");

savefilefromurl(i.i + "folder_up.svg", "system/icons/folder_up.svg", 0, "t=svg");

savefilefromurl(i.i + "folder_search.svg", "system/icons/folder_search.svg", 0, "t=svg");

savefilefromurl(i.i + "mainos_folder.svg", "system/icons/mainos_folder.svg", 0, "t=svg");

savefilefromurl(i.i + "fullscreen.svg", "system/icons/fullscreen.svg", 0, "t=svg");






// copy some directories


copyUserFolderOnceEverythingWritten();


function copyUserFolderOnceEverythingWritten() {
    if(openAsyncFiles.length == 0) {
        copyFolder("C:/users/default/", "C:/users/public/");
        copyFolder("C:/users/default/", i.up, 1);
        setAttribute("C:/users/public/", "A", "");
        setAttribute(i.up, "A", "");
        userFolderCopied = true;
        reportOpenAsyncFiles();
    } else {
        window.setTimeout(function() {
            copyUserFolderOnceEverythingWritten();
        },500);
    }
}

// Dynamic settings (import from user's machine)
if(navigator.language == "en") {
    var initLang = "en"
} else if(navigator.language == "de") {
    var initLang = "de"
} else {
    var initLang = "en"
}
savefile(i.ups + "language.txt", initLang, 0, "t=txt,A=!");

// Append some attributes
setAttribute("C:/users/default/", "A", getAttribute("C:/users/default/", "A") + "0a");

// cleanup
if(isfolder("C:/users/undefined/")) {
    deletefile("C:/users/undefined/",1)
}


// setTimeout(function() {
//  location.reload();
// }, 60);

throughIOfs = true;

};

function maybeReload() {
    if (throughIOfs && openAsyncFiles.length == 0 && userFolderCopied == true) {
        location.reload();
    }
}
