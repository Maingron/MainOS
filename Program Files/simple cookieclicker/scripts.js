var cookies = 0;
var machines = [];
var objects = {};
var cps = 0;
var storagePath;

// Translations
if(system.user.settings.language == "de") { // German
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
	var result = `
	<button onclick="buy(${a+1})">
	<b>${machineList[a][0]}</b>
	<br>
	${lang.price}: ${machineList[a][1]}
	<br>
	${lang.CpS}: ${machineList[a][2]}
	</button>
	`;
	return result;
}


function clicked() {
	cookies++;
	updateCookieCounter();
}

function buy(which) { // Buy automatic cookies
	if(cookies >= machineList[which - 1][1]) {
		cookies -= machineList[which - 1][1];
		machines[which - 1] += 1;
	}
	updateCookieCounter();

	iofs.save(storagePath+"machines.txt", JSON.stringify(machines), "", 1);
}

function updateCookieCounter() {
	cps = 0;
	for(let j = 0; machines.length > j; j++) {
		cps += machines[j] * machineList[j][2];
	}
	objects.cookiecount.innerHTML = cookies + "<sub>" + cps + "/s</sub>";
}

function install(storagePath) {
	if(!iofs.exists(storagePath)) {
		iofs.save(storagePath, "", "t=dir", 0, 1);
	}

	if (iofs.exists(storagePath+"cookies.txt")) {
		cookies = +iofs.load(storagePath+"cookies.txt");
	} else {
		iofs.save(storagePath+"cookies.txt", cookies, "", 1);
	}
	
	if (!iofs.exists(storagePath+"machines.txt")) {
		for(let k = 0; machineList.length > k; k++) {
			machines[k] = 0;
		}
		iofs.save(storagePath+"machines.txt", JSON.stringify(machines), "", 1);
	}
}

window.addEventListener('message', function(event) {
	if (event.data === 'pWindowReady') {
		storagePath = pWindow.getPath("data");

		install(storagePath);

		buildHtml();

		machines = iofs.load(storagePath+"machines.txt"); // Load file
		machines = JSON.parse(machines); // Convert file into JSON / Array

		objects.cookiecount = document.getElementsByClassName("cookiecount")[0];
		updateCookieCounter();

		setInterval(function () {
			iofs.save(storagePath+"cookies.txt", cookies, "", 1);
		}, 1000);

		// Automatic cookies
		setInterval(function () {
			for(let j = 0; machines.length > j; j++) {
				cookies += +machines[j] * +machineList[j][2];
			}
			updateCookieCounter();
		}, 1000);
	}
});

function buildHtml() {

	for(let i = 0; machineList.length > i; i++) {
		document.getElementById("storenav").innerHTML += generateStoreItem(i);
	}
	
	document.getElementById("lang.store").innerHTML = lang.Store;

	document.querySelector("#cookie").addEventListener("click", clicked);
}