if (!parent.loadfile("C:/Program Files/Simple Cookieclicker")) {
  parent.savefile("C:/Program Files/Simple Cookieclicker", "");
}

if (parent.loadfile("C:/Program Files/Simple Cookieclicker/cookies.txt")) {
  var cookies = parent.loadfile("C:/Program Files/Simple Cookieclicker/cookies.txt");
} else {
  var cookies = 0;
}

cookies = cookies;

var machines = {};


if (!parent.loadfile("C:/Program Files/Simple Cookieclicker/machines.txt")) {
  init();
}

function init() {
  machines.machine1 = 0;
  machines.machine2 = 0;
  machines.machine3 = 0;
  machines.machine4 = 0;
  parent.savefile("C:/Program Files/Simple Cookieclicker/machines.txt", JSON.stringify(machines), 1);
}

machines = parent.loadfile("C:/Program Files/Simple Cookieclicker/machines.txt");
machines = JSON.parse(machines);


var objects = {};
objects.cookiecount = document.getElementsByClassName("cookiecount")[0];
objects.version = document.getElementsByClassName("version")[0];


objects.cookiecount.innerHTML = cookies;


function clicked() {
  if (objects.cookiecount.innerHTML != cookies) {
    if (objects.cookiecount.innerHTML == "error") {
      cookies = "You are the king of <br /> COOKIES!.....";
    } else {
      cookies = -1;
    }
  } else {
    cookies++;
  }
  objects.cookiecount.innerHTML = cookies;
}


setInterval(function () {
  parent.savefile("C:/Program Files/Simple Cookieclicker/cookies.txt", cookies, 1);
}, 1000);


setTimeout(function () {
  objects.version.style.opacity = "0";
  objects.version.style.color = "#ff0";
}, 4000);

//check for automatic cookie thing stuff stuff things 42
setInterval(function () {
  cookies = +cookies + machines.machine1 * 1
  cookies = +cookies + machines.machine2 * 5
  cookies = +cookies + machines.machine3 * 12
  cookies = +cookies + machines.machine4 * 25

  objects.cookiecount.innerHTML = cookies;

}, 1000);

function buy(which) {
  if (which == "machine1") {
    if (cookies >= 25) {
      cookies = +cookies - 25;
      machines.machine1 = +machines.machine1 + 1;
    }
  }

  if (which == "machine2") {
    if (cookies >= 120) {
      cookies = +cookies - 120;
      machines.machine2 = +machines.machine2 + 1;
    }
  }

  if (which == "machine3") {
    if (cookies >= 450) {
      cookies = +cookies - 450;
      machines.machine3 = +machines.machine3 + 1;
    }
  }

  if (which == "machine4") {
    if (cookies >= 1200) {
      cookies = +cookies - 1200;
      machines.machine4 = +machines.machine4 + 1;
    }
  }


  objects.cookiecount.innerHTML = cookies;
  parent.savefile("C:/Program Files/Simple Cookieclicker/machines.txt", JSON.stringify(machines), 1);
}

