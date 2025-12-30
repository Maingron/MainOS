const tasklist = document.getElementsByClassName("tasklist")[0];
let osProcessList;

window.addEventListener('message', function(event) {
	if (event.data === 'pWindowReady') {
		loadTaskList();
	} else if(typeof event.data == "object") {
		if(event?.data?.event == "processListChanged") {
			osProcessList = os.getProcessList();
			if(event.data?.eventSub == "programStarted") {
				pushToProcessList(osProcessList.find(proc => proc.pid == event.data.pid));
			} else if(event.data?.eventSub == "programClosed") {
				removeFromProcessList(event.data.pid);
			} else {
				updateTaskList();
			}
		}
	}
});


function pushToProcessList(processObject) {
	let pid = processObject.pid;
	if(tasklist.querySelector(`tr[data-pid="${pid}"]`)) {
		refreshListEntry(tasklist.querySelector(`tr[data-pid="${pid}"]`), processObject);
		return;
	}
	let newLine = document.createElement("tr");
	newLine.setAttribute("data-pid", pid);
	newLine.innerHTML = `
		<td class="icon task-icon">
			<img src="${processObject.icon}">
		</td>
		<td class="task-title">
			${processObject.title}
		</td>
		<td class="task-id">
			${processObject.programIdentifier}
		</td>
		<td class="task-pid">
			${processObject.pid}
		</td>
		<td class="task-actions">
			<button onclick="closeTask(${processObject.pid})">Close</button>
			<button onclick="killTask(${processObject.pid})">Kill</button>
			<button onclick="focusTask(${processObject.pid})">Focus</button>
		</td>
	`;
	tasklist.appendChild(newLine);
}

function removeFromProcessList(pid) {
	for(let i = 0; i < tasklist.children.length; i++) {
		if(tasklist.children[i].getAttribute("data-pid") == pid) {
			tasklist.children[i].remove();
		}
	}
}

function refreshListEntry(entryHTMLObject, processObject) {
	if(entryHTMLObject.querySelector(".task-icon img").src != processObject.icon) {
		entryHTMLObject.querySelector(".task-icon img").src = processObject.icon;
	}
	if(entryHTMLObject.querySelector(".task-title").innerText != processObject.title) {
		entryHTMLObject.querySelector(".task-title").innerText = processObject.title;
	}
	if(entryHTMLObject.querySelector(".task-pid").innerText != processObject.pid) {
		entryHTMLObject.querySelector(".task-pid").innerText = processObject.pid;
	}
	if(entryHTMLObject.querySelector(".task-id").innerText != processObject.programIdentifier) {
		entryHTMLObject.querySelector(".task-id").innerText = processObject.programIdentifier;
	}
	
}

function loadTaskList() {
	tasklist.querySelectorAll("tr:not(.header)").forEach((element) => {
		element.remove();
	});

	osProcessList = os.getProcessList();

	for(let processObject of osProcessList) {
		pushToProcessList(processObject);
	}
}

function updateTaskList() {
	osProcessList = os.getProcessList();
	let allLines = tasklist.querySelectorAll("tr:not(.header)");

	osProcessList.forEach((processObject) => {
		let found = false;
		allLines.forEach((line) => {
			if(line.getAttribute("data-pid") == processObject.pid) {
				found = true;
				refreshListEntry(line, processObject);
			}
		});
		
		if(!found) {
			pushToProcessList(processObject);
		}

	});

	allLines.forEach((line) => {
		let found = false;
		osProcessList.forEach((processObject) => {
			if(line.getAttribute("data-pid") == processObject.pid) {
				found = true;
			}
		});
		if(!found) {
			line.remove();
		}
	});
		

}

function closeTask(which) {
	pWindow.os.unrun(parent.getWindowById(which), false);
}

function killTask(which) {
	pWindow.os.unrun(parent.getWindowById(which), true);
}

function focusTask(which) {
	pWindow.os.focusWindow(parent.getWindowById(which));
}


window.setInterval(updateTaskList, 500);
