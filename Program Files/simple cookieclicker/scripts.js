if (!loadfile("C:/Program Files/Simple Cookieclicker")) {
  savefile("C:/Program Files/Simple Cookieclicker", "");
}

if (loadfile("C:/Program Files/Simple Cookieclicker/cookies.txt")) {
  var cookies = loadfile("C:/Program Files/Simple Cookieclicker/cookies.txt");
} else {
  var cookies = 0;
}

cookies = cookies;

var machines = {};


if (!loadfile("C:/Program Files/Simple Cookieclicker/machines.txt")) {
  init();
}

function init() {
  machines.machine1 = 0;
  machines.machine2 = 0;
  machines.machine3 = 0;
  machines.machine4 = 0;
  machines.machine5 = 0;
  machines.machine6 = 0;
  machines.machine7 = 0;
  machines.machine8 = 0;
  savefile("C:/Program Files/Simple Cookieclicker/machines.txt", JSON.stringify(machines), 1);
}

machines = loadfile("C:/Program Files/Simple Cookieclicker/machines.txt");
machines = JSON.parse(machines);


var objects = {};
objects.cookiecount = document.getElementsByClassName("cookiecount")[0];
objects.version = document.getElementsByClassName("version")[0];

objects.cookiecount.innerHTML = cookies;


function clicked() {
  if (objects.cookiecount.innerHTML != cookies) {
    if (objects.cookiecount.innerHTML == "error") {
      cookies = "You are the king of <br> COOKIES!.....";
    } else {
      cookies = -1;
    }
  } else {
    cookies++;
  }
  objects.cookiecount.innerHTML = cookies;
}


setInterval(function () {
  savefile("C:/Program Files/Simple Cookieclicker/cookies.txt", cookies, 1);
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
  cookies = +cookies + machines.machine5 * 50
  cookies = +cookies + machines.machine6 * 100
  cookies = +cookies + machines.machine7 * 1000
  cookies = +cookies + machines.machine8 * 10000

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

  if (which == "machine5") {
    if (cookies >= 4000) {
      cookies = +cookies - 4000;
      machines.machine5 = +machines.machine5 + 1;
    }
  }

  if (which == "machine6") {
    if (cookies >= 10000) {
      cookies = +cookies - 10000;
      machines.machine6 = +machines.machine6 + 1;
    }
  }

  if (which == "machine7") {
    if (cookies >= 100000) {
      cookies = +cookies - 100000;
      machines.machine7 = +machines.machine7 + 1;
    }
  }

  if (which == "machine8") {
    if (cookies >= 1000000) {
      cookies = +cookies - 1000000;
      machines.machine8 = +machines.machine8 + 1;
    }
  }


  objects.cookiecount.innerHTML = cookies;
  savefile("C:/Program Files/Simple Cookieclicker/machines.txt", JSON.stringify(machines), 1);
}

