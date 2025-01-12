function submit(inputcontent = document.querySelector("#input").value) {
	if(system.user.programs[inputcontent]) {
		try {
			parent.run(inputcontent);
			pWindow.close();
		} catch(e) {
			pWindow.os.sendNotification({
				"title": "Error in Run",
				"content": "An error occurred while trying to run " + document.querySelector("#input").value,
				"type": "error",
				"sender": this,
				"isAlert": true
			});
		}
	} else {
		pWindow.os.sendNotification({
			"title": "Error in Run",
			"content": "Could not find a program to run for query \"" + document.querySelector("#input").value + "\"",
			"type": "error",
			"sender": this,
			"isAlert": true
		});
	}
}

window.addEventListener('message', function(event) {
	if (event.data === 'pWindowReady') {
		pWindow.setMaximized(false);
		parent.resizeWindow(pWindow.getWindow(), 360, 220);
		pWindow.focus();

		window.setTimeout(function() {
			document.querySelector("#input").focus();
		}, 200);
	}
});