objects.taskbartime = document.getElementById("taskbartime");


window.setInterval(function() {
  setting.time = new Date();
  setting.time = {
    hour: setting.time.getHours(),
    minute: setting.time.getMinutes(),

    year: setting.time.getFullYear(),
    month: setting.time.getMonth() + 1,
    day: setting.time.getDate()
  };

  if (setting.time.hour < 10) {
    setting.time.hour = "0" + setting.time.hour;
  }
  if (setting.time.minute < 10) {
    setting.time.minute = "0" + setting.time.minute;
  }

  if (setting.time.month < 10) {
    setting.time.month = "0" + setting.time.month;
  }

  if (setting.time.day < 10) {
    setting.time.day = "0" + setting.time.day;
  }




  setting.time.date = setting.time.year + "-" + setting.time.month + "-" + setting.time.day;
  setting.time.time = setting.time.hour + ":" + setting.time.minute;
  setting.time.full = setting.time.date + " " + setting.time.time;
  /* Automatically update these time displays: */
  objects.taskbartime.innerHTML = setting.time.hour + ":" + setting.time.minute;
}, 250);

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

if (setting.default_fullscreen == 1) {
  enterFullscreen(document.body);
}

if (setting.tts == 1) {

  objects.tts_script = document.createElement("script");
  objects.tts_script.src = "mainos/tts.js";
  document.body.appendChild(objects.tts_script);

} else {
  function make_tts() {};
}



document.getElementById("background").style.backgroundImage = "url(" + setting.backgroundimage + ")";


setTimeout(function() {
  for (i = 0; i < setting.temp.toautostart.length; i++) {
    run(setting.temp.toautostart[i]);
  }
}, 500);

function notification(title, content) {

  if (document.getElementsByClassName("notifications")[0] != null) {
    document.getElementsByClassName("notifications")[0].contentWindow.send_notification(title, content);

  } else {
    run("notifications", {
      "title": title,
      "content": content
    });
  }
}

window.alert = notification;