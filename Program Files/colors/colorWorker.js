"use strict";
self.onmessage = function(event) {
	const { seed, length, start } = event.data;
	const colors = Array.from({ length }, (_, i) => randomColor(seed + (start + i)));
	postMessage(colors);
};

function randomColor(seed) {
	const x = Math.abs(Math.sin(hashCode(seed)) * 16777215) % 16777215;
	const r = (x >> 16) & 255;
	const g = (x >> 8) & 255;
	const b = x & 255;
	return `rgb(${r}, ${g}, ${b})`;
}

function hashCode(str) {
	let hash = 0, i, chr;
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	return hash;
}
