const config = {
  "enableBubble": true
};

const notificationFilePath = pWindow.getPath("data") + "notifications.txt";
const notificationWindow = pWindow.getWindow();
const notificationContainer = document.getElementsByClassName("notifications")[0];
let notificationBubble;
let notificationIcon = createNotificationIcon();

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
  content.time = content.time.toLocaleString();
  content.sender = getSender(content.sender); // Get the sender of the notification; We will override any custom value to prevent spoofing
  notifications.push(content);
  refreshNotifications();
  parent.savefile(notificationFilePath, JSON.stringify(notifications), 1, "t=txt");
  toggleNotificationWindow(true);
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
        if(myNotification.sender && system.user.programs[myNotification.sender]) {
          notificationElement.innerHTML = `
          <img src="${system.user.programs[myNotification.sender].icon}" class="notification_icon" ondblclick="parent.run('${myNotification.sender}')">
        ` + notificationElement.innerHTML;
        }
        notificationContainer.appendChild(notificationElement);
    }
    setNotificationBubble();
}

function getSender(which) {
  if(!which) {
    return "undefined";
  }
  return os.getProgramByMagic(which);
}

refreshNotifications();
updateNotificationWindow();


setInterval(updateNotificationWindow, 100);

function init() {
  notifications = JSON.parse(parent.loadfile(notificationFilePath, 0));
}

function createNotificationIcon() {
  if(parent.document.getElementById("taskbarrighticons")) {
    if(!parent.document.getElementById("notifications")) {
      let notificationIconTemp = document.createElement("a");
      notificationIconTemp.id = "notifications";
      notificationIconTemp.className = "notifications has_hover";
      notificationIconTemp.style.height = "100%";
      notificationIconTemp.addEventListener("click", function() {
        toggleNotificationWindow();
      });
      notificationIconTemp.innerHTML = "<img src='iofs:C:/Program Files/notifications/icon.png' class='icon'>";
      parent.document.getElementById("taskbarrighticons").appendChild(notificationIconTemp);

      if(config.enableBubble) {
        notificationBubble = document.createElement("span");
        notificationBubble.className = "notification_bubble";
        notificationBubble.innerHTML = "0";
        notificationIconTemp.appendChild(notificationBubble);
      }



      return notificationIconTemp;
    }
  }

}

function toggleNotificationWindow(maximize = "undefined") {
  // toggle
  if(maximize == "undefined") {
    parent.setWindowMinimized(notificationWindow);
  } else  if(maximize == true) {
    if(notificationWindow.classList.contains("minimized")) {
      pWindow.setMaximized(true);
    } else if(!notificationWindow.classList.contains("active")) {
      parent.focusWindow(notificationWindow, true);
    }
  } else if(maximize == false) {
    pWindow.setMinimized(true);
  }
  if(!notificationWindow.classList.contains("minimized")) {
      pWindow.focus();
  }
}

function getNotificationCount() {
  return notifications.length;
}

function setNotificationBubble() {
  notificationBubble.innerHTML = getNotificationCount();
  notificationBubble.style.top = "0";
  notificationBubble.style.left = "50%";
  notificationBubble.style.transform = "translate(-50%, 40%)";
  notificationBubble.style.position = "absolute";
  notificationBubble.style.display = "inline";
  notificationBubble.style.color = "red";
  notificationBubble.style.lineHeight = "1";
  notificationBubble.style.fontWeight = "900";
  if(getNotificationCount() == 0) {
    notificationBubble.innerHTML = "";
  }
}

function installer() {
  if(!parent.isfolder(pWindow.getPath("data")) || !parent.isfile(notificationFilePath)) {
    parent.savefile(pWindow.getPath("data"), "", 0, "t=dir");
    parent.savefile(notificationFilePath, "[{}]", 1, "t=txt");
    sendNotification({
      "title": "Notifications initialized",
      "content": "The notifications app has been successfully initialized.",
      "sender": this,
      "time": new Date(),
      "type": "success"
    });
  }
}

function createHook() {
    os.sendNotification = sendNotification;
}

createHook();