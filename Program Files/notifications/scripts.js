const programPath = parent.setting.userdata + "Notifications/";
const notificationFilePath = programPath + "notifications.txt";
const notificationWindow = parent.getWindowByMagic(this);
const notificationContainer = document.getElementsByClassName("notifications")[0];
let notifications = [];
installer();
init();


function is_online() {
  return 1;
}


function sendNotification(content) {
  if(!content.time) {
    content.time = new Date();
  }
  notifications.push(content);
  refreshNotifications();
  parent.savefile(notificationFilePath, JSON.stringify(notifications), 1, "t=txt");
  // Example:
  // sendNotification({
  //   "title": "test",
  //   "content": "test",
  //   "sender": "test",
  //   "type": "warning"
  // });
}

function removeNotification(which) {
  notifications.splice(which, 1);
  refreshNotifications();
  parent.savefile(notificationFilePath, JSON.stringify(notifications), 1, "t=txt");
}

function updateNotificationWindow() {
  if(document.body.offsetHeight + "px" != notificationWindow.style.height) {
    notificationWindow.style.bottom = "0";
    notificationWindow.style.right = "0";
    notificationWindow.style.top = "";
    notificationWindow.style.left = "";
    notificationWindow.style.width = "30%";
    notificationWindow.style.height = "100%";
    // notificationWindow.style.height = document.body.offsetHeight + "px";
    // notificationWindow.style.maxHeight = "calc(100vh - 35px)";
    // notificationWindow.getElementsByClassName("proframe")[0].style.height = document.body.offsetHeight + "px";
    // notificationWindow.getElementsByClassName("proframe")[0].style.maxHeight = "100%";
  }
}

function refreshNotifications() {
  notificationContainer.innerHTML = "";
    for(let myNotification of notifications) {
        let notificationElement = document.createElement("div");
        notificationElement.className = "a_notificaton";
        notificationElement.innerHTML = `
        <h3>${myNotification.title}</h3>
        <button class="rm_not" onclick="removeNotification(${notifications.indexOf(myNotification)})">x</button>
        <p>${myNotification.content}</p>
        <p class="meta">${myNotification.time}</p>
        `;
        console.log(myNotification);
        if(myNotification.sender && parent.program[myNotification.sender]) {
          notificationElement.innerHTML = `
          <img src="${parent.program[myNotification.sender].icon}" class="notification_icon" ondblclick="parent.run('${myNotification.sender}')">
        ` + notificationElement.innerHTML;
        }
        notificationContainer.appendChild(notificationElement);
    }
}

refreshNotifications();
updateNotificationWindow();


setInterval(updateNotificationWindow, 100);

function init() {
  notifications = JSON.parse(parent.loadfile(notificationFilePath, 0));

  if(parent.document.getElementById("taskbarrighticons")) {
    if(!parent.document.getElementById("notifications")) {
      let notificationIcon = document.createElement("a");
      notificationIcon.id = "notifications";
      notificationIcon.className = "notifications has_hover";
      notificationIcon.style.height = "100%";
      notificationIcon.addEventListener("click", function() {
        console.log();
        toggleNotificationWindow();
      });
      notificationIcon.innerHTML = "<img src='iofs:C:/Program Files/notifications/icon.png' class='icon'>";
      parent.document.getElementById("taskbarrighticons").appendChild(notificationIcon);
    }
  }
}



function toggleNotificationWindow() {
  parent.setWindowMinimized(parent.getWindowsByName("notifications")[0].parentElement);
}

function installer() {
  if(!parent.isfolder(programPath) || !parent.isfile(notificationFilePath)) {
    parent.savefile(programPath, "", 0, "t=dir");
    parent.savefile(notificationFilePath, "[{}]", 1, "t=txt");
    sendNotification({
      "title": "test",
      "content": "blablabla. <br>lfköadjlkjfödaslkj",
      "sender": "test",
      "time": "2022-01-01 00:00:00",
      "type": "warning"
    });
  }
}

