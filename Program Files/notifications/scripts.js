var objects = {};
objects.notifications = document.getElementsByClassName("notifications")[0];
var one_notification = "<div></div>";
var needinit = 0;
if (parent.isfile(parent.setting.userdata + "Notifications") == 0) {
  needinit = 1;
  parent.savefile(parent.setting.userdata + "Notifications/", "", 0, "t=dir");
  parent.savefile(parent.setting.userdata + "Notifications/notifications.txt", new Array("{\"title\":\"dummy\",\"content\":\"dummy\"}"), 1, "t=txt");
  parent.savefile(parent.setting.userdata + "Notifications/Notification History.log", "", 0, "t=log");
}


var notifications = parent.loadfile(parent.setting.userdata + "Notifications/notifications.txt").split("},");
for (var i = 0; i < notifications.length - 1; i++) {
  notifications[i] = notifications[i] + "}";
}

if (needinit == 1) {
  send_notification("Notifications is set up.", "Successfully initialized Notifications.<br>Here you can see your notifications :)");
  send_notification("Cookie Hint", "MainOS sets Cookies / Local Storage Data based on what you save. That's just what an OS does. Data is not sent to anyone, it's all your data.");
  parent.savefile(parent.setting.userdata + "Notifications/notifications.txt", notifications, 1, "t=txt");
}

function is_online() {
  return (1);
}


function send_notification(title, content) {
  parent.savefile(parent.setting.userdata + "Notifications/Notification History.log", parent.loadfile(parent.setting.userdata + "Notifications/Notification History.log") + parent.setting.time.full + "\n" + title + "\n" + content + "\n\n");
  content = content.replace(/\n/g, '<br>');
  notifications.push("{\"title\":\"" + title + "\",\"content\":\"" + content + "\"}");
  parent.savefile(parent.setting.userdata + "Notifications/notifications.txt", notifications, 1, "t=txt");
  refreshNotifications()
}


function remove_notification(which) {
  notifications.splice(which, 1);
  parent.savefile(parent.setting.userdata + "Notifications/notifications.txt", notifications, 1, "t=txt");
  refreshNotifications()
}


if (typeof window.parent.attr == "object") {
  send_notification(parent.attr.title, parent.attr.content);
}

function refreshNotifications() {

  objects.notifications.innerHTML = "";
  for (i = 0; i < notifications.length; i++) {

    var thisnotification = parent.ifjsonparse(notifications[i]);
    if (thisnotification.title == "dummy" && thisnotification.content == "dummy") {
      continue;
    }

    objects.notifications.innerHTML += "<div class='a_notificaton'><h3>" + thisnotification.title + "</h3><button class='rm_not' onclick='remove_notification(" + i + ")'>x</button><p>" + thisnotification.content + "</p></div>";
  }

  if (notifications.length <= 1) {
    parent.document.getElementsByClassName("notifications")[0].parentElement.style.width = "220px";
    parent.document.getElementsByClassName("notifications")[0].parentElement.style.right = "-200px";
    parent.document.getElementsByClassName("notifications")[0].parentElement.style.minWidth = "0";
  } else {
    parent.document.getElementsByClassName("notifications")[0].parentElement.style.width = "25%";
    parent.document.getElementsByClassName("notifications")[0].parentElement.style.right = "0";
    parent.document.getElementsByClassName("notifications")[0].parentElement.style.minWidth = "250px";
  }
}


parent.document.getElementsByClassName("notifications")[0].parentElement.classList.remove('maximized');
parent.document.getElementsByClassName("notifications")[0].parentElement.style.transition = "0s";
parent.document.getElementsByClassName("notifications")[0].parentElement.style.width = "0";
parent.document.getElementsByClassName("notifications")[0].parentElement.style.height = "50%";
parent.document.getElementsByClassName("notifications")[0].parentElement.style.backgroundColor = "transparent";
parent.document.getElementsByClassName("notifications")[0].parentElement.style.bottom = "25%";
parent.document.getElementsByClassName("notifications")[0].parentElement.style.right = "-30%";
parent.document.getElementsByClassName("notifications")[0].parentElement.style.top = "auto";
parent.document.getElementsByClassName("notifications")[0].parentElement.style.left = "auto";
parent.document.getElementsByClassName("notifications")[0].parentElement.style.overflow = "hidden";
parent.document.getElementsByClassName("notifications")[0].style.height = "100%";


setTimeout(function() {
  parent.document.getElementsByClassName("notifications")[0].parentElement.style.transition = "1.5s";
  parent.document.getElementsByClassName("notifications")[0].parentElement.style.right = "0";
  parent.document.getElementsByClassName("notifications")[0].parentElement.style.width = "30%";
  refreshNotifications();
}, 500);


document.documentElement.style.setProperty("--font", parent.setting.font);

if (parent.loadfile(parent.setting.userdata + "notifications/notify_changelog.dat") !== "") {
  send_notification("Changes to MainOS - What's new:", parent.loadfile(parent.loadfile(parent.setting.userdata + "notifications/notify_changelog.dat")));
  parent.savefile(parent.setting.userdata + "notifications/notify_changelog.dat", "", 1, "t=txt");
}