var cookies = 0;
var machines = [];
var objects = {};

// Translations
if(parent.setting.language == "de") { // German
  var lang = {
    "price": "Preis",
    "Price": "Preis",
    "CpS": "KpS",
    "AutomaticClicker": "Automatischer Klicker",
    "Grandma": "Großmutter",
    "Robot": "Roboter",
    "SmallRobotArmy": "Kleine Roboter Armee",
    "BigRobotArmy": "Große Roboter Armee",
    "CookieWizardTier1": "Kekszauberer (Stufe 1)",
    "CookieWizardTier2": "Kekszauberer (Stufe 2)",
    "CookieWizardTier3": "Kekszauberer (Stufe 3)",
    "Infinity": "Endlosigkeit",
    "Store": "Laden",
  }
} else { // default lang (English)
  var lang = {
    "price": "price",
    "Price": "Price",
    "CpS": "CpS",
    "AutomaticClicker": "Automatic Clicker",
    "Grandma": "Grandma",
    "Robot": "Robot",
    "SmallRobotArmy": "Small Robot Army",
    "BigRobotArmy": "Big Robot Army",
    "CookieWizardTier1": "Cookie Wizard (Tier 1)",
    "CookieWizardTier2": "Cookie Wizard (Tier 2)",
    "CookieWizardTier3": "Cookie Wizard (Tier 3)",
    "Infinity": "Infinity",
    "Store": "Store"
  }
}

document.getElementById("lang.store").innerHTML = lang.Store;


const machineList = [
  // ["Name", Cost, CpS],
  [lang.AutomaticClicker,25,1],
  [lang.Grandma,120,5],
  [lang.Robot,450,12],
  [lang.SmallRobotArmy,1200,25],
  [lang.BigRobotArmy,4000,50],
  [lang.CookieWizardTier1,10000,100],
  [lang.CookieWizardTier2,100000,1000],
  [lang.CookieWizardTier3,1000000,10000]
];

function generateStoreItem(a) {
  var result = "";
  result += "<a href='#' onclick='buy("+(a+1)+")'><b>";
  result += machineList[a][0];
  result += "</b><br>";
  result += lang.Price + ": " + machineList[a][1];
  result += "<br>";
  result += lang.CpS + ": " + machineList[a][2];
  result += "</a>";
  return result;
}


for(var i = 0; machineList.length > i; i++) {
  document.getElementById("storenav").innerHTML += generateStoreItem(i);
}


if(!isfolder("C:/Program Files/Simple Cookieclicker/")) {
  savedir("C:/Program Files/Simple Cookieclicker/");
}


if (isfile("C:/Program Files/Simple Cookieclicker/cookies.txt")) {
  cookies = +loadfile("C:/Program Files/Simple Cookieclicker/cookies.txt");
} else {
  savefile("C:/Program Files/Simple Cookieclicker/cookies.txt", cookies, 1);
}

if (!isfile("C:/Program Files/Simple Cookieclicker/machines.txt")) {
  init();
}

function init() {
  for(var k = 0; machineList.length > k; k++) {
    console.log(k);
    machines[k] = 0;
  }
  savefile("C:/Program Files/Simple Cookieclicker/machines.txt", JSON.stringify(machines), 1);
}

machines = loadfile("C:/Program Files/Simple Cookieclicker/machines.txt"); // Load file
machines = JSON.parse(machines); // Convert file into JSON / Array


objects.cookiecount = document.getElementsByClassName("cookiecount")[0];
objects.cookiecount.innerHTML = cookies;


function clicked() {
  cookies++;
  objects.cookiecount.innerHTML = cookies;
}

setInterval(function () {
  savefile("C:/Program Files/Simple Cookieclicker/cookies.txt", cookies, 1);
}, 1000);


// Automatic cookies
setInterval(function () {
  for(var j = 0; machines.length > j; j++) {
    cookies += +machines[j] * +machineList[j][2];
  }
  objects.cookiecount.innerHTML = cookies;
}, 1000);


function buy(which) { // Buy automatic cookies
  if(cookies >= machineList[which - 1][1]) {
    cookies -= machineList[which - 1][1];
    machines[which - 1] +=  1;
  }

  objects.cookiecount.innerHTML = cookies;
  savefile("C:/Program Files/Simple Cookieclicker/machines.txt", JSON.stringify(machines), 1);
}

