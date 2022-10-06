const tasklist = document.getElementsByClassName("tasklist")[0];
let pids = parent.pid;
let pidsPrevious = [];


refreshTaskList();


function refreshTaskList() {
    if(pids.toString() != pidsPrevious.toString()) { // If the task list has changed
        pidsPrevious = pids.slice();

        tasklist.innerHTML = `
        <tr>
            <th title="icon"></th>
            <th>Title</th>
            <th>ID</th>
            <th title="Process ID">Pid</th>
            <th>Actions</th>
        </tr>
        `;
        for(let i = 0; i < pids.length; i++) {
            if(pids[i] != undefined && pids[i] != null && pids[i] != "") {
                tasklist.innerHTML += `
                <tr>
                    <td class="icon">
                        <img src="${parent.program[pids[i]].icon}">
                    </td>
                    <td>
                        ${parent.program[pids[i]].title}
                    </td>
                    <td>
                        ${pids[i]}
                    </td>
                    <td>${i}</td>
                    <td>
                        <button onclick="killTask(${i})">Kill</button>
                        <button onclick="focusTask(${i})">Focus</button>
                    </td>
                </tr>`;
            }
        }
    }
}

function killTask(which) {
    parent.unrun(parent.getWindowById(which));
}

function focusTask(which) {
    parent.focusWindow(parent.getWindowById(which));
}


window.setInterval(refreshTaskList, 100);