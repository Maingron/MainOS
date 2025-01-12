var celldata = {};

let props = {
	visibleRows: 0, // Number of visible rows
	visibleCols: 0, // Number of visible columns
	rowHeight: 30, // Height of each row in pixels
	colWidth: 100, // Width of each column in pixels
	startRow: 0,
	startCol: 0,
	zoomLevel: 100 // Initial zoom level
};

function calculateVisibleRowsCols() {
	const gridContainer = document.getElementById('grid-container');
	props.visibleRows = Math.floor(gridContainer.clientHeight / props.rowHeight);
	props.visibleCols = Math.floor(gridContainer.clientWidth / props.colWidth);
}

function getCellKey(row, col) {
	let colLetter = '';
	while (col >= 0) {
		colLetter = String.fromCharCode((col % 26) + 65) + colLetter;
		col = Math.floor(col / 26) - 1;
	}
	return `${colLetter}${row + 1}`; // Combine column letter and row number (1-based)
}

function createGrid() {
	calculateVisibleRowsCols();
	const grid = document.getElementById('grid');
	grid.innerHTML = '';

	for (let i = 0; i < props.visibleRows; i++) {
		const row = document.createElement('div');
		row.className = 'row';
		for (let j = 0; j < props.visibleCols; j++) {
			const cell = document.createElement('div');
			cell.className = 'cell';
			cell.contentEditable = true; // Make cell editable
			cell.setAttribute('data-row', i);
			cell.setAttribute('data-col', j);
			const cellKey = getCellKey(i, j);
			cell.innerText = celldata[cellKey] || ''; // Use value from celldata object or empty string
			cell.addEventListener('focus', () => updateStatusBar(cell));
			cell.addEventListener('blur', () => {
				const row = cell.getAttribute('data-row');
				const col = cell.getAttribute('data-col');
				const cellKey = getCellKey(parseInt(row), parseInt(col));
				if (cell.innerText) {
					celldata[cellKey] = cell.innerText; // Update celldata object on blur
				} else {
					delete celldata[cellKey]; // Remove empty values from celldata object
				}
			});
			row.appendChild(cell);
		}
		grid.appendChild(row);
	}
}

function updateGrid(startRow, startCol) {
	const rows = document.getElementsByClassName('row');
	for (let i = 0; i < props.visibleRows; i++) {
		const cells = rows[i].getElementsByClassName('cell');
		for (let j = 0; j < props.visibleCols; j++) {
			cells[j].innerText = ''; // Clear cell content
		}
	}
	for (let i = 0; i < props.visibleRows; i++) {
		const cells = rows[i].getElementsByClassName('cell');
		for (let j = 0; j < props.visibleCols; j++) {
			const cellKey = getCellKey(startRow + i, startCol + j);
			cells[j].innerText = celldata[cellKey] || ''; // Use value from celldata object or empty string
			cells[j].setAttribute('data-row', startRow + i);
			cells[j].setAttribute('data-col', startCol + j);
			cells[j].addEventListener('focus', () => updateStatusBar(cells[j]));
			cells[j].addEventListener('blur', () => {
				if(cells[j].innerText) {
					celldata[+cells[j].getAttribute('data-row'), cells[j].getAttribute('data-col')] = cells[j].innerText; // Update celldata object on blur
				} else {
					delete celldata[cellKey]; // Remove empty values from celldata object
				}
			});
		}
	}
}

function updateScrollBars() {
	const verticalScrollBar = document.getElementById('vertical-scroll-bar');
	const horizontalScrollBar = document.getElementById('horizontal-scroll-bar');

	const totalRows = Object.keys(celldata).reduce((max, key) => Math.max(max, parseInt(key.match(/\d+/)[0])), 0) + 10; // Add extra rows for overscroll
	const totalCols = Object.keys(celldata).reduce((max, key) => Math.max(max, key.replace(/\d/g, '').split('').reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0)), 0) + 10; // Add extra columns for overscroll

	verticalScrollBar.style.height = `${(props.visibleRows / totalRows) * 100}%`;
	verticalScrollBar.style.top = `${(props.startRow / totalRows) * 100}%`;

	horizontalScrollBar.style.width = `${(props.visibleCols / totalCols) * 100}%`;
	horizontalScrollBar.style.left = `${(props.startCol / totalCols) * 100}%`;
}

function onWheel(event) {
	event.preventDefault();
	const deltaY = event.deltaY;
	const deltaX = event.deltaX;

	if (deltaY > 0) {
		props.startRow++;
	} else if (deltaY < 0 && props.startRow > 0) {
		props.startRow--;
	}

	if (deltaX > 0) {
		props.startCol++;
	} else if (deltaX < 0 && props.startCol > 0) {
		props.startCol--;
	}

	updateGrid(props.startRow, props.startCol);
	updateScrollBars();
	document.getElementById('scroll-indicator').innerText = `Row: ${props.startRow}, Col: ${props.startCol}`;
}

function onVerticalScrollBarMouseDown(event) {
	const startY = event.clientY;
	const startTop = parseFloat(document.getElementById('vertical-scroll-bar').style.top);

	function onMouseMove(event) {
		const deltaY = event.clientY - startY;
		const newTop = startTop + (deltaY / document.getElementById('grid-container').clientHeight) * 100;
		const totalRows = Object.keys(celldata).reduce((max, key) => Math.max(max, parseInt(key.match(/\d+/)[0])), 0) + 10; // Add extra rows for overscroll
		const maxTop = 100 - (props.visibleRows / totalRows) * 100;
		if (newTop >= 0 && newTop <= maxTop) {
			props.startRow = Math.floor((newTop / 100) * totalRows);
			updateGrid(props.startRow, props.startCol);
			updateScrollBars();
			document.getElementById('scroll-indicator').innerText = `Row: ${props.startRow}, Col: ${props.startCol}`;
		}
	}

	function onMouseUp() {
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	}

	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);
}

function onHorizontalScrollBarMouseDown(event) {
	const startX = event.clientX;
	const startLeft = parseFloat(document.getElementById('horizontal-scroll-bar').style.left);

	function onMouseMove(event) {
		const deltaX = event.clientX - startX;
		const newLeft = startLeft + (deltaX / document.getElementById('grid-container').clientWidth) * 100;
		const totalCols = Object.keys(celldata).reduce((max, key) => Math.max(max, key.replace(/\d/g, '').split('').reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0)), 0) + 10; // Add extra columns for overscroll
		const maxLeft = 100 - (props.visibleCols / totalCols) * 100;
		if (newLeft >= 0 && newLeft <= maxLeft) {
			props.startCol = Math.floor((newLeft / 100) * totalCols);
			updateGrid(props.startRow, props.startCol);
			updateScrollBars();
			document.getElementById('scroll-indicator').innerText = `Row: ${props.startRow}, Col: ${props.startCol}`;
		}
	}

	function onMouseUp() {
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
	}

	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);
}

function updateStatusBar(cell) {
	const row = cell.getAttribute('data-row');
	const col = cell.getAttribute('data-col');
	const value = cell.innerText;
	document.getElementById('status-bar-top').innerText = `Value: ${value} | Position: Row ${parseInt(row) + 1}, Col ${getCellKey(0, parseInt(col)).replace(/\d/g, '')}`;
}

function updateZoomLevel() {
	document.getElementById('zoom-level').innerText = `Zoom: ${props.zoomLevel}%`;
}

function onZoomChange(event) {
	props.zoomLevel = event.target.value;
	document.getElementById('grid-container').style.zoom = `${props.zoomLevel}%`;
	updateZoomLevel();
}

window.addEventListener('resize', () => {
	calculateVisibleRowsCols();
	createGrid();
	updateGrid(props.startRow, props.startCol);
	updateScrollBars();
});

document.getElementById('grid-container').addEventListener('wheel', onWheel);
document.getElementById('vertical-scroll-bar').addEventListener('mousedown', onVerticalScrollBarMouseDown);
document.getElementById('horizontal-scroll-bar').addEventListener('mousedown', onHorizontalScrollBarMouseDown);
document.getElementById('zoom-slider').addEventListener('input', onZoomChange);

createGrid();
updateScrollBars();
updateZoomLevel();
