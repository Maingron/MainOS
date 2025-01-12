self.addEventListener('message', function(event) {
	if (event.data.type === 'loadSite') {
		self.clients.get(event.source.id).then(function(client) {
			client.postMessage({
				type: 'siteLoaded',
				url: event.data.url
			});
		});
	}

	if (event.data.type === 'loadFavicon') {
		self.clients.get(event.source.id).then(function(client) {
			client.postMessage({
				type: 'faviconLoaded',
				url: 'https://www.google.com/s2/favicons?sz=64&domain_url=' + event.data.url
			});
		});
	}
});
