const webframe = document.getElementById('webframe');
const urlbar = document.getElementById('urlbar');
const favicon = document.getElementById('favicon');

var config = {
	"homepage": 'websites/start/start.html'
}

var currentURL;

function loadSite() {
	webframe.src = currentURL;
}

function loadFavicon() {
	favicon.src = 'https://www.google.com/s2/favicons?sz=64&domain_url=' + currentURL;
}

function parseURL(url) {
	var resultingUrl = url;

	if(url.startsWith('websites/')) {
		resultingUrl = resultingUrl;
	} else if(!url.startsWith('http://') && !url.startsWith('https://')) {
		resultingUrl = 'https://' + resultingUrl;
	}

	return resultingUrl;
}

function sendRequest(url) {
	currentURL = parseURL(url);
	loadSite();
	loadFavicon();
	urlbar.value = currentURL;
	setTimeout(checkFunctionalityAndReturnUrl, 300);
	checkFunctionalityAndReturnUrl();
}

function checkFunctionalityAndReturnUrl() {
	var result;
	try {
		result = webframe.contentWindow.location.href
		toggleControls(true);
	} catch(e) {
		result = currentURL;
		toggleControls(false);
	}
	return result;
}

function toggleControls(status) {
	if(status == true) {
		document.getElementById('websitecontrols').removeAttribute('disabled');
	} else {
		document.getElementById('websitecontrols').setAttribute('disabled', true);
	}
}

// constantly check if the loaded website is still the same as the one in the urlbar
// setInterval(function() {
// 	if(checkFunctionalityAndReturnUrl() != currentURL) {
// 		sendRequest(checkFunctionalityAndReturnUrl());
// 	}
// }, 500);


sendRequest(config.homepage);

// when webframe loaded
webframe.addEventListener('load', function(e) {
	if(checkFunctionalityAndReturnUrl() != currentURL) {
		sendRequest(checkFunctionalityAndReturnUrl());
	}
});

// try to hijack links in the webframe and replace them with sendRequest(url)
webframe.addEventListener('load', function(e) {
	var links = webframe.contentWindow.document.getElementsByTagName('a');
	for(var i = 0; i < links.length; i++) {
		links[i].addEventListener('click', function(e) {
			e.preventDefault();
			sendRequest(e.target.href);
		});
	}
});
