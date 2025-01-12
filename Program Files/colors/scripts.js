"use strict";
var colors = [];

window.addEventListener('message', function(event) {
	if (event.data === 'pWindowReady') {
		init();
		window.removeEventListener('message', this);
	}
});

function init() {
	const seed = loadOrInitializeSeed();
	var workers = [];
	const numThreads = Math.max(1, navigator.hardwareConcurrency - 2);

	for (let i = 0; i < numThreads; i++) {
		workers.push(new Worker('colorWorker.js'));
	}

	function createSquares(colors) {
		const fragment = document.createDocumentFragment();
		colors.forEach(color => {
			const square = document.createElement("div");
			square.style.backgroundColor = color;
			square.onclick = () => copyToClipboard(square.style.backgroundColor);
			fragment.appendChild(square);
		});
		document.getElementById("imgs").appendChild(fragment);
	}

	function copyToClipboard(text) {
		const input = document.createElement("input");
		input.value = text;
		document.body.appendChild(input);
		input.select();
		document.execCommand("copy");
		document.body.removeChild(input);
	}

	function checkSpawn(forced = false, count = 140) {
		if (forced || window.scrollY >= document.body.offsetHeight - window.innerHeight * 4) {
			const lengthPerThread = Math.ceil(count / numThreads);
			for (let i = 0; i < numThreads; i++) {
				const start = colors.length + i * lengthPerThread;
				workers[i].postMessage({ seed, length: lengthPerThread, start });
			}
		}
	}

	workers.forEach(worker => {
		worker.onmessage = function(event) {
			createSquares(event.data);
		};
	});

	window.setTimeout(function() {
		checkSpawn(true, 500);
		checkSpawn(true, 1000);
	}, 0);

	window.addEventListener('scroll', function() {
		checkSpawn(false);
	});
}

// load or initialize the seed
function loadOrInitializeSeed() {
	const folderPath = pWindow.getPath('data');
	if (!iofs.exists(folderPath)) {
		iofs.save(folderPath, '', { t: 'd' });
	}

	const seedPath = folderPath + 'seed.txt';
	let seed = 'maingron';
	if (iofs.exists(seedPath)) {
		seed = iofs.load(seedPath, true);
	} else {
		iofs.save(seedPath, seed);
	}
	return seed;
}
