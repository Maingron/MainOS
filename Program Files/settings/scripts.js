var settingtabs = document.getElementsByClassName("settingtab");
var objects = {};
objects.bool_range = document.getElementsByClassName("bool_range");

function setting_send(which, who) {
  parent.savefile(parent.setting.settingpath + who + ".txt", which.value, 1, "t=txt");
  parent.loadsettings();
  document.documentElement.style.setProperty("--themecolor", setting.themecolor);
  document.documentElement.style.setProperty("--font", setting.font);
}

function setting_load(which, who) {
  which.value = parent.loadfile(parent.setting.settingpath + who + ".txt");
}

function showsettingtab(which) {
  for (j = 0; j < settingtabs.length; j++) {
    settingtabs[j].style.display = "none";
  }
  document.getElementById(which).style.display = "block";
  document.getElementById("home").style.display = "none";
  document.getElementById("header").style.display = "block";
}

function gohome() {
  for (j = 0; j < settingtabs.length; j++) {
    settingtabs[j].style.display = "none";
  }
  document.getElementById("home").style.display = "";
  document.getElementById("header").style.display = "none";

}

var all_settings = document.getElementsByClassName("settinginput");

for (i = 0; i < all_settings.length; i++) {
  all_settings[i].value = parent.loadfile(parent.setting.settingpath + all_settings[i].title + ".txt");
}
