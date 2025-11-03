"use strict";

const webframe = document.getElementById('webframe');
const urlbar = document.getElementById('urlbar');
const favicon = document.getElementById('favicon');

var config = {
	"homepage": 'websites/start/start.html'
}

var currentURL;

navigator.serviceWorker.register('service-worker.js').then(function(registration) {
	initializeBrowser();
});

function initializeBrowser() {
	navigator.serviceWorker.ready.then(function() {
		sendRequest(config.homepage);

		webframe.addEventListener('load', function(e) {
			if(checkFunctionalityAndReturnUrl() != currentURL) {
				sendRequest(checkFunctionalityAndReturnUrl());
			}
		});

		webframe.addEventListener('load', function(e) {
			var links = webframe.contentWindow.document.getElementsByTagName('a');
			for(var i = 0; i < links.length; i++) {
				links[i].addEventListener('click', function(e) {
					e.preventDefault();
					const href = e.target.closest('a').href;
					sendRequest(href);
				}, true); // Use capturing instead of bubbling
			}
		});

		navigator.serviceWorker.addEventListener('message', function(event) {
			if (event.data.type === 'siteLoaded') {
				webframe.src = event.data.url;
			}

			if (event.data.type === 'faviconLoaded') {
				favicon.src = event.data.url;
			}
		});
	});
}

function loadSite() {
	if (navigator.serviceWorker.controller) {
		navigator.serviceWorker.controller.postMessage({
			type: 'loadSite',
			url: currentURL
		});
	}
}

function loadFavicon() {
	if (navigator.serviceWorker.controller) {
		navigator.serviceWorker.controller.postMessage({
			type: 'loadFavicon',
			url: currentURL
		});
	}
}

function parseURL(url) {
	if (typeof url !== 'string') {
		return '';
	}

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
