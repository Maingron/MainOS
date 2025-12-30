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
			// Update URL bar to show the actual loaded URL when accessible
			var actualUrl = checkFunctionalityAndReturnUrl();
			if(actualUrl && actualUrl !== 'about:blank' && actualUrl !== currentURL) {
				// Only update URL bar if we can access the iframe location
				try {
					var iframeUrl = webframe.contentWindow.location.href;
					if (iframeUrl && iframeUrl !== 'about:blank') {
						urlbar.value = iframeUrl;
					}
				} catch(e) {
					// Can't access iframe location (CORS), keep current URL bar value
				}
			}
		});

		webframe.addEventListener('load', function(e) {
			try {
				var links = webframe.contentWindow.document.getElementsByTagName('a');
				for(var i = 0; i < links.length; i++) {
					links[i].addEventListener('click', function(e) {
						e.preventDefault();
						const href = e.target.closest('a').href;
						sendRequest(href);
					}, true); // Use capturing instead of bubbling
				}
			} catch(e) {
				// Can't access iframe content (CORS), link handling won't work
			}
		});

		navigator.serviceWorker.addEventListener('message', function(event) {
			if (event.data.type === 'siteLoaded') {
				webframe.src = event.data.url;
			}

			if (event.data.type === 'faviconLoaded') {
				favicon.src = event.data.url;
				pWindow.icon = event.data.url;
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

function checkIframeAllowed(url, callback) {
	// Skip check for local/internal pages
	if (url.startsWith('websites/') || url.startsWith('about:') || url === '') {
		callback(true, url);
		return;
	}

	// Try to check if the URL allows iframe embedding via XHR
	// Note: This only works if the server supports CORS and exposes headers
	var xhr = new XMLHttpRequest();
	
	// Use HEAD request to minimize bandwidth
	xhr.open('HEAD', url, true);
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status >= 200 && xhr.status < 300) {
				var xFrameOptions = xhr.getResponseHeader('X-Frame-Options');
				var csp = xhr.getResponseHeader('Content-Security-Policy');
				
				var isBlocked = false;
				
				// Check X-Frame-Options header
				if (xFrameOptions) {
					var xFrameUpper = xFrameOptions.toUpperCase();
					// DENY blocks all framing, SAMEORIGIN blocks cross-origin framing
					if (xFrameUpper === 'DENY' || xFrameUpper === 'SAMEORIGIN') {
						isBlocked = true;
					}
				}
				
				// Check Content-Security-Policy frame-ancestors directive
				if (csp) {
					var cspLower = csp.toLowerCase();
					if (cspLower.includes('frame-ancestors')) {
						// frame-ancestors 'none' blocks all framing
						// frame-ancestors 'self' blocks cross-origin framing
						// More robust parsing: check for these as complete tokens
						var frameAncestorsMatch = cspLower.match(/frame-ancestors\s+([^;]+)/);
						if (frameAncestorsMatch) {
							var directive = frameAncestorsMatch[1].trim();
							// Check if directive starts with 'none' or 'self' (as complete tokens)
							if (directive.startsWith("'none'") || directive.startsWith("'self'")) {
								isBlocked = true;
							}
						}
					}
				}
				
				if (isBlocked) {
					// Redirect to archive.org if iframe is not allowed
					var archiveUrl = 'https://web.archive.org/web/' + url;
					callback(false, archiveUrl);
				} else {
					callback(true, url);
				}
			} else {
				// On HTTP error, try loading anyway (might be temporary)
				callback(true, url);
			}
		}
	};
	
	xhr.onerror = function() {
		// If XHR fails (likely CORS restriction), try loading the page anyway
		// The iframe will handle the blocking if needed
		callback(true, url);
	};
	
	xhr.ontimeout = function() {
		// If request times out, proceed with loading
		callback(true, url);
	};
	
	// Set reasonable timeout
	xhr.timeout = 5000; // 5 seconds
	
	try {
		xhr.send();
	} catch (e) {
		// If send fails, proceed anyway
		callback(true, url);
	}
}

function sendRequest(url) {
	var parsedUrl = parseURL(url);
	
	checkIframeAllowed(parsedUrl, function(isAllowed, finalUrl) {
		currentURL = finalUrl;
		loadSite();
		loadFavicon();
		// Show the actual URL that will be loaded
		// If redirected to archive, show the archive URL
		urlbar.value = finalUrl;
		setTimeout(checkFunctionalityAndReturnUrl, 300);
		checkFunctionalityAndReturnUrl();
	});
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
