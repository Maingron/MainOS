document.title = "MainOS: Updating...";
document.write("<div id='iinfo' style='position:fixed; display:inline-block; top:0; left:0; height:100%; width:100%; background-color:var(--themecolor); z-index:123456789; transition:.4s;'><center><h1 style='display:inline-block;'>Updating...</h1></center></div>");
var chgd = "C:/Documents and Settings/Changelogs";

savefile("C:/", "", 0, "t=dir");
savefile("D:/", "", 0, "t=dir");
savefile("C:/users", "", 0, "t=dir");
savefile("C:/mainos", "", 0, "t=dir");
savefile("C:/mainos/temp", "", 0, "t=dir");
savefile("C:/mainos/temp/cmdhistory.dat", "", 0, "t=txt");
savefile("C:/mainos/system32", "", 0, "t=dir");
savefile("C:/mainos/system32/exists.dat", "true", 1, "t=txt");

savefile("C:/mainos/system32/FirstVersion.txt", mainos.version, 0, "t=txt");
savefile("C:/mainos/system32/FirstVersionnr.txt", mainos.versionnr, 0, "t=txt");
savefile("C:/Documents and Settings", "", 0, "t=dir");
savefile("C:/Documents and Settings/appdata", "", 0, "t=dir");

savefile("C:/Program Files", "", 0, "t=dir");
savefile("C:/mainos/format MainOS.del", "cmd('js parent.formatfs(\"yes\")')", 0, "t=cmd");

savefile("C:/mainos/system32/settings", "", 0, "t=dir");
savefile("C:/mainos/system32/settings/username.txt", "User", 1, "t=txt");
setting.username = loadfile("C:/mainos/system32/settings/username.txt");
if (setting.username != "User") {
 savefile("C:/mainos/system32/settings/username.txt", "User", 0, "t=txt");
 setting.username = "User";
}

savefile("C:/users/" + setting.username, "", 0, "t=dir");

savefile("C:/users/" + setting.username + "/settings", "", 0, "t=dir");
savefile("C:/users/" + setting.username + "/settings/backgroundimage.txt", "Documents%20and%20Settings/All%20Users/My%20Documents/Images/fluent.jpg", 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/developer.txt", 0, 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/themecolor.txt", "#222", 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/darkmode.txt", 0, 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/notsodarkmode.txt", 0, 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/hovercolor.txt", "#ffaa0077", 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/hovercolornontransparent.txt", "#ffaa00", 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/tts.txt", 0, 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/font.txt", "'Tahoma', 'Roboto', 'Arial', sans-serif", 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/repository.txt", 1, 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/orangemode.txt", 0, 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/big_buttons.txt", 0, 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/default_fullscreen.txt", 0, 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/language.txt", "en", 0, "t=txt");
savefile("C:/users/" + setting.username + "/settings/german_tv.txt", 0, 0, "t=txt");

savefile("C:/users/" + setting.username + "/Program Data", 0, 0, "t=dir");

savefile("C:/Documents and Settings/wallpapers.txt", "Links to wallpapers to use as background image for MainOS\n\nWallpapers made by Michael Gillett (https://twitter.com/MichaelGillett):\n https://maingron.de/things/wp/michael_gillett/fluent.jpg\n https://maingron.de/things/wp/michael_gillett/andromeda.jpg\n https://maingron.de/things/wp/michael_gillett/bliss-night.jpg\n https://maingron.de/things/wp/michael_gillett/clippy-x-rex.jpg (modified by Maingron)\n https://maingron.de/things/wp/michael_gillett/polaris.jpg", 0, "t=txt");

savefile("C:/Documents and Settings/Credits.txt", "MainOS Credits:\n\nMainOS is a one-man project, though some people contributed to it. Thanks to:\n\nDavid King - Optisocubes | https://twitter.com/dr_d_king\nMichael Gillett - Wallpapers | https://twitter.com/MichaelGillett\n\nYou - Enjoying MainOS", 1, "t=txt");

savefile("C:/Documents and Settings/More Programs.txt", "If you want more programs, open cmd and type 'setting repository 1'. Afterwards restart MainOS.", 0, "t=txt");


savefile(chgd, " ", 0, "t=dir");
savefile(chgd + "/Version 0AL.txt", "This is basically the first public MainOS Version.", 0, "t=txt");
savefile(chgd + "/Version 0AM.txt", "This version brings much better compression and some bug fixes.\nThe maybe best bug fix is in Paint: If the mouse gets stuck in paint mode, you can free it now.", 0, "t=txt");
savefile(chgd + "/Version 0AN.txt", "This version brings several bugfixes and features like:\n- The lightblue right piece was added to the Taskbar\n- A clock was added to the Taskbar\n- Programs don't spawn behind other programs anymore, so they spawn(open) in front of any other program so you can directly start to use them without fiddling around", 0, "t=txt");
savefile(chgd + "/Version 0AO.txt", "With this version tons of new features come. Here the documented ones summarized:\n- Overall UI Improvements:\n--- Dragging of programs improved; Dragging & Jumping bug should be removed\n--- Paint: Mouse shouldn't get stuck anymore, no matter what\n--- Most things can't be randomly selected and/or dragged anymore\n--- Icons on the desktop should look and feel better: Icons won't cut themselves in half anymore and the whole icon should be clickable now\n- New game: David Kings game \"Optisocubes\" comes with this version\n- Aggressive cleanup of files: This version is a lot smaller than version 0AN - About 1 MB instead of 4 MB\n- Shutdown button in the Startmenu closes MainOS. Doesn't work everytime\n- Removed Gallery and added \"Colors\" instead\n- Removed unused stuff from the Startmenu\n- IOfs got added: Now it's possible to work with files, but this is still in heavy development and can't be used to store files in this version.\n--- Placed Format File to C:/mainos/format MainOS.del\n--- Explorer got improved:\n----- You can explore your virtual \"IOfs\" Harddrive(s)\n----- You can go up one folder\n----- Not working buttons on the top aren't shown\n----- Files get displayed different than before.\n- Compressed and uglified most of the code to make it harder to steal and modify it without permission.\n- Sure there are other changes, but I didn't write them down. Have fun! :)", 0, "t=txt");
savefile(chgd + "/Version 0AP.txt", "After a long Time period - Version 0AP brings following features:\n... But first: Quick info: This is a speed update. Also the next update shouldn't take too long.\n- FMP happens faster than in the previous version (Basically MainOS boots faster)\n- Removed Query entirely: MainOS now runs without jQuery\n- Some scripts now load asynchronously\n- script.min.js and style.min.css files now get automatically generated and used instead of script.js and style.js\n- Probably some other stuff I haven't written down", 0, "t=txt");
savefile(chgd + "/Version 0AQ.txt", "This Version adds following features:\n- Increased Version Number\n- The Explorer opens Notepad and the .txt file when opening a .txt file\n- The Notepad can now save files\n- The Notepad can now open files (with a gui)\n- Added Book directory and books: \"Lorem Ipsum.txt\" & \"Wiki Windows XP.txt\"\n- Added about 17 .txt files to C:/mainos/test - named 1.txt - 16.txt\n- IOfs doesn't format each time you restart MainOS anymore. To be able to check this, a file got added to C:/mainos/system32\nThis Version removes the following features:\n- The animated logo on the desktop got removed to increase performance", 0, "t=txt");
savefile(chgd + "/Version 0AR.txt", "This version adds the following features:\n- Increased version Number to Version 0AR\n- Added Hype Chat which is still in development\n- Added Changelogs to C:/Documents and Settings/Changelogs/\n- Changed desktop background image\n- Added Credits.txt to C:/Documents and Settings/\n- Added pi π.txt to C:/Documents and Settings/Books/\n- Increased refresh frequency to 1/8. Now the clock refreshes every 0.25 seconds. Before it was 2.0 seconds\n- Moved C:/mainos/test and C:/mainos/test/* to C:/Documents and Settings/Testfiles/\n- Changed filename-overflowing behavior in explorer\n- Changed default program position and size\n\nThis version removes the following features:\n- Animated icon on Desktop got removed entirely", 0, "t=txt");
savefile(chgd + "/Version 0AS.txt", "This version adds the following features:\n- Increased version Number to Version 0AS\n- Added check and message for expected version and actual version. If the user updates he will receive this message. \"It might be necessary to format IOfs in order to see changes. Just open Explorer and click on \"C:/Complete Update and format MainOS.del\"\" \n- Added Simple Cookieclicker Version 0.1\n- Added Report Bug entry to Start\n- Fixed bug: Storing \"0\" in a file doesn't cause an error anymore", 0, "t=txt");
savefile(chgd + "/Version 0AT.txt", "This version adds the following features:\n- Increased version Number to Version 0AT\n- Fixed a bug that didn't allow the user to run MainOS inside the browser - Problem were probably security policies of itch.io and a missing style file", 0, "t=txt");
savefile(chgd + "/Version 0AU.txt", "This version adds the following features:\n- Increased version Number to Version 0AU\n- Added changelog for Version 0AT since it wasn't included with Version 0AT\n- Added iFrame that preloads things\n- Added style.css from the startmenu to the preloader iFrame so it doesn't look ugly anymore when opening it the first time\n- Added Textdocument Property. Just type something like \"font=Alien Encounters, Desdemona Black, Comic Sans MS, Calibri Light, Calibri;\" - Don't forget \";\" at the end!\n- Set default Font for Notepad to Tahoma\n- Added Textdocument Property for Font Size. Just type something like \"fontsize=20px;\" - Dont forget \";\"at the end\nUpdated Simple Cookieclicker to Version 0.2 - Now you can buy machines", 0, "t=txt");
savefile(chgd + "/Version 0BA.txt", "This version adds the following features:\n- Increased version Number to Version 0BA\n- Changed Lindows2.engine - Try opening some programs, move and resize them :)\n- Removed interactjs\n- Decreased MainOS Package size significantly\n- Paint had an unused line of code which loaded jquery externally. This line got removed\n- Paint now uses script.min.js for scripts (Earlier it used inline script)\n- If the clock isn't loaded, it displays nothing instead of TI:ME now\n- Added icon for Hype chat\n\nThis Version removes the following features:\n- Mouse Settings got removed since it was useless and outdated", 0, "t=txt");
savefile(chgd + "/Version 0BB.txt", "This version adds the following features:\n- Increased version Number to Version 0BB\n- Added folder C:/mainos/system32/settings/\n- Added setting for desktop wallpaper to C:/mainos/system32/settings/backgroundImage.txt\n- Moved inline to enter Fullscreen mode to script.js\n- Programs can now be dragged on touchscreens \n- Changed body position to fixed and (re)defined some other style attributes\n- Added support for very small screens\n- MainOS can now run on a New Nintendo 3DS (xl)... Sort of\n- Improved dragging of programs on computers\n- Programs can now be resized on touchscreens\n- Improved resizing of programs on computers\n- Resized program icons\n- Slightly adjusted animation time when maximizing or closing a program\n- Removed counterproductive style attribute of Explorer\n- Improved Explorer functionality on small devices", 0, "t=txt");
savefile(chgd + "/Version 0BC.txt", "This version adds the following features:\n- Added wallpapers.txt to C:/Documents and Settings\n- MainOS now uses Git(hub)", 0, "t=txt");
savefile(chgd + "/Version 0BD.txt", "This version adds the following features:\n- Increased version Number to Version 0BD\n- Added developer setting (IAmADeveloper.txt) to settings folder and set default value to \"no\"; If you are a developer, set it to \"yes\"\n- Added program.cmd and set it to devonly\n- Added spawnicon property to program.*, if set to 0, program won't spawn an icon\n- Added devonly property to program.*, if set to 1, program won't spawn if mainos.settings.developer is not set to 1\n- Changed program spawning technique; Programs now will spawn according to their entry in the program list\n- Added div for programs in which programs will spawn\n- Removed devonly property from cmd\n- Added commands to cmd: echo, cls, clear, run, exit, js::native - Documentation and/or help command will be added soon\n- Added commands to cmd: toggledev\n- Added rain to cmd?! - How to trigger it though? 🤔\n- Removed a bug where windows would close when resized\n", 0, "t=txt");
savefile(chgd + "/Version 0BE.txt", "This version adds the following features:\n- Increased version Number to Version 0BE\n- CMD History (temp file) now gets reset after every command\n- Improved CMD security\n- Added help command to cmd\n- Added close command to cmd\n- Added 0 & 1 to toggledev command in cmd\n- Removed green_hills.jpg - not more to say\n- Changed default background image to 'C:/Documents and Settings/All Users/My Documents/Images/fluent.jpg' - check out the creator at https://twitter.com/MichaelGillett :)\n- Changed background color of MainOS (remember: backgroundImage > backgroundColor)\n- Added MainOS Icon to every wallpaper\n- Added SVG favicon to MainOS\n- Removed automatic capitalization of the 1st letter on mobile devices in cmd", 0, "t=txt");
savefile(chgd + "/Version 0BF.txt", "This version adds the following features:\n- Increased version Number to Version 0BF\n- Added themeColor setting\n- Added settings command to cmd\n- Made all settings lowercase\n- Changed Setting 'IAmADeveloper' to 'developer' and made it a boolean\n- Added restart command to cmd\n- Added Setting 'darkmode', default value: 0\n- Added variable 'setting.*' for settings - If you are a developer, please don't use 'mainos.settings.*' anymore because it will be removed soon.\n- Added function to reload settings to MainOS so changes to the settings may not need a restart to take effect\n- Included darkmode to the start menu (try it in cmd by typing 'setting darkmode 1')\n- Added Setting 'username', default value: 'User'\n- Added Username to start menu\n- Changed look of start menu\n- Changed background color of program frames\n- Changed icons on desktop from divs to buttons\n- Changed close and maximize button of programs from divs to buttons\n- Added alts and text that will only be read from screen readers, so blind people may in near future be able to use MainOS - oh, and Talkback on Android is actually pretty cool :)\n- Removed orange border that sometimes appeared on buttons\n- Function \"close()\" is now \"unrun()\". close() will be removed soon.\n- Added setting tts, default value: 0 - TTS optimizes content for screen readers and deoptimizes content for people who can see correctly\n- Changed size of MainOS logo over the background image\n- Renamed img/Fullscreen.png to img/fullscreen.png\n- Added Fullscreen button to desktop again\n- Added eggpng\n- Optimized Paint and added more colors to it", 0, "t=txt");
savefile(chgd + "/Version 0BG.txt", "This version adds the following features:\n- Changed project name from 'Lindows 2' to 'MainOS'\n- Increased version Number to Version 0BG\n- Added setting for font, default value: 'Tahoma', 'Roboto', Sans-Serif\n- Changed layout of the close and maximize/windowed mode button - not just for a more modern look but also because it can improve functionality\n- \"Removed\" eggpng\n- Added transparent.png to img/\n- Made changes to the MainOS logo\n- Changed Fullscreen icon and made it an SVG\n- Changed Optisocubes icon and made it an SVG", 0, "t=txt");
savefile(chgd + "/Version 0BH.txt", "This version adds the following features:\n- Increased version Number to Version 0BH\n- Added notification center but it is disabled by default. Open it by running 'run notifications'\n- Made variable 'mainos.*' a constant\n- Added deletefile() to IOfs\n- Removed progadd() from IOfs\n- Added file properties. Files can / must have now properties. Current properties: Date of last save (d=xxxx)\n- Corrected multiple errors that appeared because of the new file properties\n- Added property \"autostart\" to programs, default value: 0\n- Added function vari(which) - it can tell you a users name or the path for settings. As a developer, try \"window.alert(parent.vari('path.user.settings'))\";\n- Added function isfile(path)\n- Added function isnofile(path), which reverses the return of isfile(path)\n- Changed behavior of IOfs creation - MainOS doesn't need to be resetted anymore when updating\n- Added file property for filetype (e.g.: t=txt)\n- Added 'First Version Number' and 'Expected Version Number'. Versions are now measured in numbers\n- Added function ifjsonparse() - it parses a json string if possible, else '{}' will be returned\n- Added repository, activate it by typing in CMD 'setting repository 1' - For security reasons, yet it's disabled by default. Don't forget to restart :)\n- Fixed stuff in iofs.js\n- Added property \"sandbox\" to programs, default value: 0\n\nIf you want to have more programs, open CMD and type 'setting repository 1', restart afterwards.", 0, "t=txt");
savefile(chgd + "/Version 00040 (0BI).txt", "This version adds the following features:\n- Changed Version identification type to numeric\n- Added update screen\n- Bugfix: The repository wasn't reachable because maingron.de changed to maingron.com - now the XML Request goes to maingron.com by default and is defined under C:/mainos/system32/settings/repositorypath.txt", 0, "t=txt");
savefile(chgd + "/Version 00050 (0BJ).txt", "- Removed obsolete function close()\n- Added function gooff(), which is supposed to shutdown MainOS, in most browsers this won't work though\n- Added Polyfill from polyfill.io to core (Loading from the Internet)\n- Made mainos a variable again\n- Started moving mainos vars to C:/mainos/system32/vars.dat\n- Changed path to repository\n- Removed C:/mainos/system32/settings/repositorypath.txt\n- Changed default Theme color to #222 (Gray). New installations will start with this Theme color.\n- Fixed a bug in Paint where you were able to drag pixels in Firefox\n- Made minor changes to style.css", 0, "t=txt");
savefile(chgd + "/Version 00060 (0BK).txt", "Warning: This version breaks some features, especially in cmd.\n\n- Added setting orangemode\n- Added variable ismainos and set it to 1\n- Activated the repository by default\n- Added program property tryxml which would load a program using xml instead of a traditional iframe\n- Added folder and variable appdata\n- Added function to be able to open mutliple windows of the same program - Programs now also spawn differently and MainOS should boot faster\n- Added program property isstartmenu for the Start menu\n- Added user-scalable=0 to metadata", 0, "t=txt");
savefile(chgd + "/Version 00070.txt", "- Updated Paint and made it more compatible\n- Added Paint 32x32, which is Paint, but with more pixels\n- Updated Explorer and made it more compatible\n- Added Event Listener 'click' to close- and maxbuttons to make them more compatible\n- Added command 'pids' to cmd which lists the currently running programs.\n- Further image compression improvements to .pngs\n- Bugfixes", 0, "t=txt");
savefile(chgd + "/Version 00080.txt", "- Changed Settingpath to C:/users/USERNAME/settings. The setting username is still at C:/mainos/system32/settings, but it shouldn't be changed. Any other value than 'User' would result in errors, because there's no user generation yet.\n- Added Settings App (beta)\n- Fixed Settingpath in cmd", 0, "t=txt");
savefile(chgd + "/Version 00090.txt", "- Defined position for content div and redefined height and width\n- Added setting 'Big Buttons'\n- Added setting 'Fullscreen by default'\n- Started developing Theme Builder\n- Added setting.userpath\n- Added setting.userdata\n- Added function jsoncombine()\n- Added class program.id to program iframes\n- Added function wait(), which halts the entire system for x ms. Might be updated so the system won't hang. Max waiting time is 500ms.\n- Fixed Autostart\n- Made the notification from Colors work with the new notification system\n- Added notifications\n- Reassigned function alert() to notification(), to enhance user experience, though this might not work sometimes.\n- Variable --font is now automatically set in programs. Due to security policies, you still shouldn't rely on it.\n- Added possibility to limit max running instances of a program with maxopen - The highest you can define is about 100\n- Configured notifications and Start Menu to a instance limit of 1\n- Removed old notification system\n", 0, "t=txt");
savefile(chgd + "/Version 00100.txt", "### Core / Various\n````- Fixed Filepaths in Notifications\n````- Added Notification Log\n````- You can now open .log Files with Notepad when using Explorer\n````- Added year, month, day, date, time and full to settings.time\n````- Added setting for language\n````- Added setting for German TV stations (Available only, when language is set to German)\n````- Added ZDF and KiKA as German TV stations\n````- Added current language to Taskbar\n````- Added button to the MainOS website\n````- Switched from style.min.css to style.css\n````- Switched from script.min.js and script_async.min.js to script.js and script_async.js\n````- Switched from vars.min.js and iofs.min.js to vars.js and iofs.js\n````- Switched from createiofs.min.js to createiofs.js\n````- Removed some temporary stuff to fix specific versions from iofs.js\n````- Removed 'Use strict' from some js files\n\n### Explorer:\n````- Switched from explorerstyle.min.css to explorerstyle.css\n````- Switched from innerexplorer.min.js to innerexplorer.js\n\n### CMD:\n````- Switched from scripts.min.js to scripts.js\n````- Added title 'CMD'\n\n### Colors:\n````- Some code cleanup\n````- Removed test achivement\n````- Switched from imgstyle.min.css to imgstyle.css\n````- Added title 'colors'\n\n### Hype chat:\n````- Switched from style.min.css and script.min.js to style.css and script.js\n````- Changed title to 'Hype chat'\n````- Removed HTML lang and dir\n\n### Notepad:\n````- Switched from notepad.min.css and notepad.min.js to notepad.css and notepad.js\n````- Some code cleanup\n\n### Notifications:\n````- Changed empty title to 'Notifications'\n````- Changed from style.min.css to style.css\n````- Removed HTML dir \n\n### Paint (Not Paint 32x32):\n````- Switched from paint.min.css and script.min.js to paint.css and script.js\n````- Some code cleanup\n````- Added title 'Paint'\n````\n### Settings beta:\n````- Switched from style.min.css to style.css\n````- Some code cleanup\n\n### Simple Cookieclicker:\n````- Added title 'Simple Cookieclicker'\n````- Switched from scripts.min.js to scripts.js\n````- Some code cleanup", 0, "t=txt");

savefile(chgd + "/Version 00110.txt", "### Core / Various\n````- Replaced some PNGs with SVGs\n````- Changed the MainOS Logo\n````- Changed old version type(mainos.versionlt) id to 0CC, where it will stay from now on. Will be removed entirely soon\n````- Removed dir and lang from html in index.html\n````- Code optimisations in index.html\n````- Removed all traces of the Midi engine\n````- IOFS: Code optimisations\n````- IOFS Generator: Optimisations\n````- TTS: Code optimisations\n````- Removed unused progreg.js and progreg.min.js\n````- Removed unused helper.js and helper.css\n````- Moved from normal style.css to style.scss\n````- Added helper.css\n````- Added helper.js - Developers are supposed to include it into their programs\n````- Added Darkmode v2, which currently automatically switches to darkmode, if your host system is set to use darkmode and your browser supports it\n````- Added variables --font --themecolor --black --black2 --black3 --black4 --black5 --hovercolor --hovercolornontransparent --beige --beige2 --beige3 --beige4 --altbarheight --altbarcolor to helper.css\n````- Decided to switch from blueish hover colors to a uniformly orange color\n````- Added setting 'hovercolor' and 'hovercolornontransparent'\n````- Dropped support for Internet Explorer entirely\n\n### Explorer\n````- Updated image paths\n````- Code optimisations\n````- 'closed' Details in sidebar\n````- Added helper.js\n````- Added Darkmode v2\n````- Removed sidebar on the left side because it did not bring any functionality\n````- Code cleanup\n````- Some improvements to CSS\n\n### Desktop \n````- Changed to --hovercolor as the hover color\n````- Changed the style for the link to the project website\n\n### Startmenu\n````- Code optimisations\n````- Switched to style.css from style.min.css\n````- Added Darkmode v2\n````- Removed support for Darkmode v1\n\n### CMD\n````- Code optimisations\n\n### Notepad\n````- Code optimisations\n````- CSS improvements\n````- Added helper.js and so Darkmode v2\n\n### Settings \n````- Added Setting for Darkmode v2\n````- Added Darkmode v2\n````- Added Setting for Hover Color and Hover Color (Non Transparent variant)\n\n### Hype Chat\n````- Added helper.js\n````- Removed unnecessary CSS to make Darkmode v2 work\n\n### Soft Excel \n````- Added helper.js and Darkmode v2\n````- Added Altbar\n````- Improved column 'generation'\n````- Minor CSS improvements\n````- Removed Easter Eggs\n\n### Paint \n````- Added helper.js\n````- Added Darkmode v2\n````- Changed Lightmode design\n````- Added Altbar\n\n### Paint32x32\n````- Switched to script.js and style.css from script.min.js and style.min.js\n````- Added helper.js\n````- Added Darkmode v2\n````- Changed Lightmode design\n````- Added Altbar \n\n### Simple Cookieclicker\n````- Added helper.js and so Darkmode v2\n````- Slightly changed CSS to make Darkmode work properly", 0, "t=txt");






savefile("C:/users/" + setting.username + "/Program Data/notifications/notify_changelog.dat", chgd + "/Version 00110.txt", 1, "t=txt");



savefile("C:/Documents and Settings/Books", " ", 0, "t=dir");

savefile("C:/Documents and Settings/Books/pi π.txt", "This is your random number: " + (Math.random() * (Math.random() * 3142)).toString().split(".")[0] + "\n\n Pi:\n3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275900994657640789512694683983525957098258226205224894077267194782684826014769909026401363944374553050682034962524517493996514314298091906592509372216964615157098583874105978859597729754989301617539284681382686838689427741559918559252459539594310499725246808459872736446958486538367362226260991246080512438843904512441365497627807977156914359977001296160894416948685558484063534220722258284886481584560285060168427394522674676788952521385225499546667278239864565961163548862305774564980355936345681743241125150760694794510965960940252288797108931456691368672287489405601015033086179286809208747609178249385890097149096759852613655497818931297848216829989487226588048575640142704775551323796414515237462343645428584447952658678210511413547357395231134271661021359695362314429524849371871101457654035902799344037420073105785390621983874478084784896833214457138687519435064302184531910484810053706146806749192781911979399520614196634287544406437451237181921799983910159195618146751426912397489409071864942319615679452080951465502252316038819301420937621378559566389377870830390697920773467221825625996615014215030680384477345492026054146659252014974428507325186660021324340881907104863317346496514539057962685610055081066587969981635747363840525714591028970641401109712062804390397595156771577004203378699360072305587631763594218731251471205329281918261861258673215791984148488291644706095752706957220917567116722910981690915280173506712748583222871835209353965725121083579151369882091444210067510334671103141267111369908658516398315019701651511685171437657618351556508849099898599823873455283316355076479185358932261854896321329330898570642046752590709154814165498594616371802709819943099244889575712828905923233260972997120844335732654893823911932597463667305836041428138830320382490375898524374417029132765618093773444030707469211201913020330380197621101100449293215160842444859637669838952286847831235526582131449576857262433441893039686426243410773226978028073189154411010446823252716201052652272111660396665573092547110557853763466820653109896526918620564769312570586356620185581007293606598764861181", 0, "t=txt");

savefile("C:/Documents and Settings/Books/Lorem Ipsum.txt", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligula. Fusce fermentum. Nullam cursus lacinia erat. Praesent blandit laoreet nibh. Fusce convallis metus id felis luctus adipiscing. Pellentesque egestas, neque sit amet convallis pulvinar, justo nulla eleifend augue, ac auctor orci leo non est. Quisque id mi. Ut tincidunt tincidunt erat. Etiam feugiat lorem non metus. Vestibulum dapibus nunc ac augue. Curabitur vestibulum aliquam leo. Praesent egestas neque eu enim. In hac habitasse platea dictumst. Fusce a quam. Etiam ut purus mattis mauris sodales aliquam. Curabitur nisi. Quisque malesuada placerat nisl. Nam ipsum risus, rutrum vitae, vestibulum eu, molestie vel, lacus. Sed augue ipsum, egestas nec, vestibulum et, malesuada adipiscing, dui. Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor. Mauris sollicitudin fermentum libero. Praesent nonummy mi in odio. Nunc interdum lacus sit amet orci. Vestibulum rutrum, mi nec elementum vehicula, eros quam gravida nisl, id fringilla neque ante vel mi. Morbi mollis tellus ac sapien. Phasellus volutpat, metus eget egestas mollis, lacus lacus blandit dui, id egestas quam mauris ut lacus. Fusce vel dui. Sed in libero ut nibh placerat accumsan. Proin faucibus arcu quis ante. In consectetuer turpis ut velit. Nulla sit amet est. Praesent metus tellus, elementum eu, semper a, adipiscing nec, purus. Cras risus ipsum, faucibus ut, ullamcorper id, varius ac, leo. Suspendisse feugiat. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi. Praesent nec nisl a purus blandit viverra. Praesent ac massa at ligula laoreet iaculis. Nulla neque dolor, sagittis eget, iaculis quis, molestie non, velit. Mauris turpis nunc, blandit et, volutpat molestie, porta ut, ligula. Fusce pharetra convallis urna. Quisque ut nisi. Donec mi odio, faucibus at, scelerisque quis, convallis in, nisi. Suspendisse non nisl sit amet velit hendrerit rutrum. Ut leo. Ut a nisl id ante tempus hendrerit. Proin pretium, leo ac pellentesque mollis, felis nunc ultrices eros, sed gravida augue augue mollis justo. Suspendisse eu ligula. Nulla facilisi. Donec id justo. Praesent porttitor, nulla vitae posuere iaculis, arcu nisl dignissim dolor, a pretium mi sem ut ipsum. Curabitur suscipit suscipit tellus. Praesent vestibulum dapibus nibh. Etiam iaculis nunc ac metus. Ut id nisl quis enim dignissim sagittis. Etiam sollicitudin, ipsum eu pulvinar rutrum, tellus ipsum laoreet sapien, quis venenatis ante odio sit amet eros. Proin magna. Duis vel nibh at velit scelerisque suscipit. Curabitur turpis. Vestibulum suscipit nulla quis orci. Fusce ac felis sit amet ligula pharetra condimentum. Maecenas egestas arcu quis ligula mattis placerat. Duis lobortis massa imperdiet quam. Suspendisse potenti. Pellentesque commodo eros a enim. Vestibulum turpis sem, aliquet eget, lobortis pellentesque, rutrum eu, nisl. Sed libero. Aliquam erat volutpat. Etiam vitae tortor. Morbi vestibulum volutpat enim. Aliquam eu nunc. Nunc sed turpis. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Nulla porta dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Pellentesque dapibus hendrerit tortor. Praesent egestas tristique nibh. Sed a libero. Cras varius. Donec vitae orci sed dolor rutrum auctor. Fusce egestas elit eget lorem. Suspendisse nisl elit, rhoncus eget, elementum ac, condimentum eget, diam. Nam at tortor in tellus interdum sagittis. Aliquam lobortis. Donec orci lectus, aliquam ut, faucibus non, euismod id, nulla. Curabitur blandit mollis lacus. Nam adipiscing. Vestibulum eu odio. Vivamus laoreet. Nullam tincidunt adipiscing enim. Phasellus tempus. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. Fusce neque. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Vivamus aliquet elit ac nisl. Fusce fermentum odio nec arcu. Vivamus euismod mauris. In ut quam vitae odio lacinia tincidunt. Praesent ut ligula non mi varius sagittis. Cras sagittis. Praesent ac sem eget est egestas volutpat. Vivamus consectetuer hendrerit lacus. Cras non dolor. Vivamus in erat ut urna cursus vestibulum. Fusce commodo aliquam arcu. Nam commodo suscipit quam. Quisque id odio. Praesent venenatis metus at tortor pulvinar varius.", 0, "t=txt");

savefile("C:/Documents and Settings/Books/Wiki Windows XP.txt", "Windows XP is a personal computer operating system produced by Microsoft as part of the Windows NT family of operating systems. It was released to manufacturing on August 24, 2001, and broadly released for retail sale on October 25, 2001.\n\n\nDevelopment of Windows XP began in the late 1990s as \"Neptune\", an operating system (OS) built on the Windows NT kernel which was intended specifically for mainstream consumer use. An updated version of Windows 2000 was also originally planned for the business market; however, in January 2000, both projects were scrapped in favor of a single OS codenamed \"Whistler\", which would serve as a single OS platform for both consumer and business markets. As such, Windows XP was the first consumer edition of Windows not to be based on MS-DOS.\n\nUpon its release, Windows XP received generally positive reviews, with critics noting increased performance and stability (especially in comparison to Windows ME, the previous Windows operating system), a more intuitive user interface, improved hardware support, and expanded multimedia capabilities. However, some industry reviewers were concerned by the new licensing model and product activation system.\n\nExtended support for Windows XP ended on April 8, 2014, after which the operating system ceased receiving further support or security updates to most users. As of January 2019, 2.18% of Windows PCs run Windows XP, and the OS is still popular in some countries with up to 28% of the Windows share. \n\n\nIn the late 1990s, initial development of what would become Windows XP was focused on two individual products; \"Odyssey\", which was reportedly intended to succeed the future Windows 2000, and \"Neptune\", which was reportedly a consumer-oriented operating system using the Windows NT architecture, succeeding the MS-DOS-based Windows 98.\n\nHowever, the projects proved to be too ambitious. In January 2000, shortly prior to the official release of Windows 2000, technology writer Paul Thurrott reported that Microsoft had shelved both Neptune and Odyssey in favor of a new product codenamed \"Whistler\", after Whistler, British Columbia, as many Microsoft employees skied at the Whistler-Blackcomb ski resort. The goal of Whistler was to unify both the consumer and business-oriented Windows lines under a single, Windows NT platform: Thurrott stated that Neptune had become \"a black hole when all the features that were cut from [Windows ME] were simply re-tagged as Neptune features. And since Neptune and Odyssey would be based on the same code-base anyway, it made sense to combine them into a single project\".\n\nAt PDC on July 13, 2000, Microsoft announced that Whistler would be released during the second half of 2001, and also unveiled the first preview build, 2250. The build notably introduced an early version of Windows XP's visual styles system.\n\nMicrosoft released the first beta build of Whistler, build 2296, on October 31, 2000. Subsequent builds gradually introduced features that users of the release version of Windows XP would recognise, such as Internet Explorer 6.0, the Microsoft Product Activation system and the Bliss desktop background.\nOn February 5, 2001, Microsoft officially announced that Whistler would be known as Windows XP, where XP stands for \"eXPerience\".", 0, "t=txt");

savefile("C:/Documents and Settings/Music", " ", 0, "t=dir");



var program = {};
program.colors = {
 "id": "colors",
 "title": "Colors",
 "icon": "Program%20Files/colors/icon.png",
 "src": "Program%20Files/colors/exec.html"
};

program.excel = {
 "id": "excel",
 "title": "Soft Excel",
 "icon": "Program%20Files/excel/icon.png",
 "src": "Program%20Files/excel/exec.html"
}

program.explorer = {
 "id": "explorer",
 "title": "Explorer",
 "icon": "img/folder-search.png",
 "src": "Program%20Files/Explorer/inner/exec.html"
}

program.notepad = {
 "id": "notepad",
 "title": "Notepad",
 "icon": "Program%20Files/notepad/icon.png",
 "src": "Program%20Files/notepad/exec.html"
}

program.paint = {
 "id": "paint",
 "title": "Paint",
 "icon": "Program%20Files/paint/icon.png",
 "src": "Program%20Files/paint/exec.html"
}

program.paint32x32 = {
 "id": "paint32x32",
 "title": "Paint 32x32",
 "icon": "Program%20Files/paint32x32/icon.png",
 "src": "Program%20Files/paint32x32/exec.html"
}

program.donttagme = {
 "id": "donttagme",
 "title": "Don't Tag Me - The Game",
 "icon": "Program%20Files/Dont%20Tag%20Me/icon.png",
 "src": "Program%20Files/Dont%20Tag%20Me/exec.html"
}

program.optisocubes = {
 "id": "optisocubes",
 "title": "Optisocubes",
 "icon": "Program%20Files/optisocubes/icon.svg",
 "src": "Program%20Files/optisocubes/exec.html"
}

program.simple_cookieclicker = {
 "id": "simple_cookieclicker",
 "title": "Simple Cookieclicker",
 "icon": "Program%20Files/simple%20cookieclicker/icon.png",
 "src": "Program%20Files/simple%20cookieclicker/exec.html"
}

program.hype = {
 "id": "hype",
 "title": "Hype Chat",
 "icon": "Program%20Files/hype/icon.png",
 "src": "Program%20Files/hype/exec.html"
}

program.explorer_start = {
 "id": "explorer_start",
 "title": "startmenu",
 "icon": "Program%20Files/hype/icon.png",
 "src": "Program%20Files/Explorer/Start/exec.html",
 "noborder": 1,
 "isstartmenu": 1,
 "spawnicon": 0,
 "maxopen": 1
}

program.cmd = {
 "id": "cmd",
 "title": "cmd",
 "icon": "Program%20Files/cmd/icon.png",
 "src": "Program%20Files/cmd/exec.html",
}

program.notifications = {
 "id": "notifications",
 "title": "notifications",
 "icon": "Program%20Files/notifications/icon.png",
 "src": "Program%20Files/notifications/exec.html",
 "autostart": 1,
 "noborder": 1,
 "maxopen": 1,
 "spawnicon": 0
}

program.settings = {
 "id": "settings",
 "title": "Settings - Beta",
 "icon": "Program%20Files/settings/icon.png",
 "src": "Program%20Files/settings/exec.html",
 "autostart": 0,
 "spawnicon": 1
}

program.germantv_zdf = {
 "id": "germantv_zdf",
 "title": "ZDF",
 "icon": "img/tv_zdf.png",
 "src": "https://zdf.de",
 "spawnicon": 1,
 "germantv": 1
}

program.germantv_kika = {
 "id": "germantv_kika",
 "title": "Kinderkanal",
 "icon": "img/tv_kika.png",
 "src": "https://www.kika.de/kika-live/index.html",
 "spawnicon": 1,
 "germantv": 1
}






savefile("C:/mainos/programs.dat", JSON.stringify(program), 1, "t=txt");

savefile("C:/mainos/customprograms.txt", "{}", 0, "t=txt");

savefile("C:/mainos/system32/ExpectedVersion.txt", mainos.version, 1, "t=txt");
savefile("C:/mainos/system32/ExpectedVersionnr.txt", mainos.versionnr, 1, "t=txt");





var mainosnew = {
 "serverpath": "https://maingron.com",
 "serverroot": "https://maingron.com/projects/MainOS/server",
 "repository": "https://maingron.com/projects/MainOS/server/repository.json",
 "creator": "Maingron",
 "copyright": "Maingron 2018 - 2019"

}


try {
 mainos = Object.assign(mainos, mainosnew);
} catch (e) {

 var objs = [mainos, mainosnew],
 result = objs.reduce(function(r, o) {
 Object.keys(o).forEach(function(k) {
 r[k] = o[k];
 });
 mainos = r;
 }, {});

}

savefile("C:/mainos/system32/vars.dat", JSON.stringify(mainos), 1, "t=txt");



setTimeout(function() {
 location.reload();
}, 40);