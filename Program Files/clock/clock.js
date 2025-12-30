let clockTime;
let selectedTab;
let stopwatchStateElement;

window.addEventListener("message", (event) => {
	if(event.data == "pWindowReady") {
		stopwatchStateElement = document.querySelector(".stopwatch-state");

		if(pWindow?.variableStore?.lastSelectedTab) {
			selectTab(pWindow.variableStore.lastSelectedTab);
		} else {
			selectTab("clock");
		}
		myAnimationFrame();
	}
});

function myAnimationFrame() {
	requestAnimationFrame(myAnimationFrame);
	clockTime = pWindow.os.systemRuntime.time();

	if(pWindow.variableStore.lastSelectedTab == "clock") {
		tabFunctions.clock();
	}
	else if(pWindow.variableStore.lastSelectedTab == "stopwatch") {
		tabFunctions.stopwatch.update();
	}
}

const tabFunctions = {
	clock: function() {
		document.querySelectorAll(".ce-time").forEach((element) => {
			element.innerText = clockTime.toLocaleTimeString();
		});
		document.querySelectorAll(".ce-date").forEach((element) => {
			element.innerText = clockTime.toLocaleDateString();
		});
	},
	stopwatch: {
		start: function() {
			pWindow.variableStore.stopwatchStartTime = clockTime - (pWindow.variableStore.stopwatchElapsedTime || 0);
			stopwatchStateElement.setAttribute("data-state", "running");
		},

		stop: function() {
			pWindow.variableStore.stopwatchElapsedTime = clockTime - (pWindow.variableStore.stopwatchStartTime ?? clockTime);
			pWindow.variableStore.stopwatchStartTime = null;
			stopwatchStateElement.setAttribute("data-state", "stopped");
		},

		reset: function() {
			pWindow.variableStore.stopwatchStartTime = null;
			pWindow.variableStore.stopwatchElapsedTime = 0;
			stopwatchStateElement.setAttribute("data-state", "default");
		},

		update: function() {
			let elapsed;
			if(pWindow.variableStore.stopwatchStartTime) {
				elapsed = clockTime - pWindow.variableStore.stopwatchStartTime;
			} else {
				elapsed = pWindow.variableStore.stopwatchElapsedTime || 0;
			}

			const hours = Math.floor(elapsed / 3600000);
			const minutes = Math.floor((elapsed % 3600000) / 60000);
			const seconds = Math.floor((elapsed % 60000) / 1000);
			const milliseconds = elapsed % 1000;
			
			const formattedTime = 
				String(hours).padStart(2, '0') + ':' +
				String(minutes).padStart(2, '0') + ':' +
				String(seconds).padStart(2, '0') + '.' +
				String(milliseconds).padStart(3, '0');
			document.querySelectorAll(".sw-time").forEach((element) => {
				element.innerText = formattedTime;
			});

			// Update stopwatch state display
			if(pWindow.variableStore.stopwatchStartTime) {
				stopwatchStateElement.setAttribute("data-state", "running");
			} else if(pWindow.variableStore.stopwatchElapsedTime && pWindow.variableStore.stopwatchElapsedTime > 0) {
				stopwatchStateElement.setAttribute("data-state", "stopped");
			} else {
				stopwatchStateElement.setAttribute("data-state", "default");
			}
		}

	}
}

function selectTab(tabName) {
	pWindow.variableStore.lastSelectedTab = tabName;
	document.querySelectorAll(".tabs .tab, .tabnav .tablink").forEach((element) => {
		element.classList.remove("active");
	});
	document.querySelectorAll(`.tabs .${tabName}, .tabnav .${tabName}`).forEach((element) => {
		element.classList.add("active");
	});

	if(tabName == "clock") {
		pWindow.title = "Clock";
	} else {
		pWindow.title = tabName.charAt(0).toUpperCase() + tabName.slice(1) + " - Clock";
	}
}
