var objects = {};
var cls = 0;
objects.content = document.getElementsByClassName("content")[0];

objects.content.innerHTML = "<p class=\"cmdoutput\"></p><form autocapitalize='off' onsubmit=\"cmdsubmit();\"><input class='cmdinput'></input></form>";

objects.cmdinput = document.getElementsByClassName("cmdinput")[0];
objects.cmdoutput = document.getElementsByClassName("cmdoutput")[0];
document.documentElement.style.setProperty("--font", window.parent.setting.font);

objects.cmdoutput.innerHTML = window.parent.loadfile("C:/mainos/temp/cmdhistory.dat");
window.parent.savefile("C:/mainos/temp/cmdhistory.dat", "", 1, "t=txt");

window.scrollTo(0, document.body.scrollHeight);

objects.cmdinput.focus();
objects.cmdinput.select();


function cmdsubmit() {

  var response = runcmd("cmd:" + objects.cmdinput.value);

  if (response == "") {
    if (cls == 1) {
      window.parent.savefile("C:/mainos/temp/cmdhistory.dat", objects.cmdoutput.innerHTML + escapeHtml(objects.cmdinput.value), 1, "t=txt");
      cls = 0;
    } else {
      window.parent.savefile("C:/mainos/temp/cmdhistory.dat", objects.cmdoutput.innerHTML + escapeHtml(objects.cmdinput.value) + "<br>", 1, "t=txt");

    }

  } else {
    window.parent.savefile("C:/mainos/temp/cmdhistory.dat", objects.cmdoutput.innerHTML + escapeHtml(objects.cmdinput.value) + "<br>" + response + "<br>", 1, "t=txt");

  }

  objects.cmdoutput.innerHTML = window.parent.loadfile("C:/mainos/temp/cmdhistory.dat");
}

function runcmd(which) {
  if (parent.setting.tts == 1) {
    objects.cmdoutput.innerHTML = "Last command: <br>";
  }

  if (which.indexOf("md:") != 1) {
    return "error";
  }


  if (which.indexOf("echo") == 4) {
    return (which.split("cmd:echo")[1]);
  }

  if (which.indexOf("run") == 4) {
    window.parent.run(which.split("cmd:run ")[1]);
    return "";
  }

  if (which.indexOf("close") == 4) {
    window.parent.unrun(which.split("cmd:close ")[1]);
    return "";
  }

  if (which.indexOf("pids") == 4) {
    var result = "";
    for (j = 0; parent.pid.length > j; j++) {
      if (parent.pid[j] && parent.pid[j].length > 0) {
        result = result + "<br>" + j + "=" + parent.pid[j];
      }
    }
    return result;
  }



  if (which.indexOf("cls") == 4 || which.indexOf("clear") == 4) {
    cls = 1;
    objects.cmdoutput.innerHTML = "";
    objects.cmdinput.value = "";
    window.parent.savefile("C:/mainos/temp/cmdhistory.dat", "", 1, "t=txt");
    location.reload();
    return "";
  }

  if (which.indexOf("setting") == 4) {
    which = which.split("cmd:setting ")[1];
    which = which.toLowerCase();
    parent.savefile(parent.setting.settingpath + which.split(" ")[0] + ".txt", which.split(" ")[1], 1, "t=txt");




    window.parent.loadsettings();
    return "changed setting - a reload may be required";
  }

  if (which.indexOf("restart") == 4) {
    window.parent.location.reload();
    cls = 1;
    objects.cmdoutput.innerHTML = "";
    objects.cmdinput.value = "";
    return "";
  }


  if (which.indexOf("help") == 4) {
    return `<b class='helpb' style='font-weight:inherit'><b>cls</b> clears console<br>
    <b>echo <a>[Message]</a></b> well, it's echo...<br>
    <b>run <b>[name of program]</b></b> opens a program<br>
    <b>close <b>[pid of program]</b></b> closes a program<br>
    <b>pids </b> lists currently running programs<br><b>exit</b> closes the terminal<br>
    <b>setting <b> [Name of setting] [value]</b></b> changes a setting<br>
    <b>restart</b> restarts MainOS<br>
    </b>
    <p style='display:block;line-height:18px'>&nbsp;</p>
    <b class='helpb'>devmode commands:<br><b>js <b>js</b></b> executes js<br>`;
  }


  if (which.indexOf("toggledownfall") == 4) {
    return "<b style='color:#f55; font-weight:inherit'>Command not found. Try /mc:help to get help.</b>";
  }


  if (which.indexOf("exit") == 4) {
    objects.cmdoutput.innerHTML = "";
    objects.cmdinput.value = "";
    window.parent.savefile("C:/mainos/temp/cmdhistory.dat", "", 1, "t=txt");
    window.parent.unrun("cmd");
    location.reload();
    return "";
    die("😏");
  }

  if (which.indexOf("js ") == 4) {
    if (window.parent.setting.developer = 1) {
      window.parent.savefile("C:/mainos/temp/cmdhistory.dat", "", 1, "t=txt");
      if (which.indexOf("js ") == 4) {
        eval(which.split("cmd:js ")[1]);
        return "Ran JS Command";
      }
    } else {
      return "You have to activate the developer mode to enable js commands. Be careful though!";
    }
  }
  return "Command not defined";
}


function escapeHtml(which) {
  while (which.indexOf("<") > 4) {
    which = which.replace("<", "&lt;");
  }
  return (which);
}