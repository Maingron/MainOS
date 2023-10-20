var mouseDown = 0;

function createPaintfieldIfDifferent(size) {
	if(document.getElementById("image").classList[0] != "image" + size) {
		createPaintfield(size);
	}
}

function createPaintfield(size) {
	// if elemnt exists
	if(document.getElementById("image")) {
		document.getElementById("image").remove();
	}
	// create element
	var newElement = document.createElement("div");
	newElement.id = "image";
	document.getElementById("imagep").appendChild(newElement);

	generatePixels(size);
}

function generatePixels(size) {
	var canvascontent1 = "";
	for(i=0;i<size**2;i++) {
		canvascontent1 += "<button onmousedown='paint1(this)' onclick='paint1(this)' onmouseover='paint(this)'></button>";
	}
	document.getElementById("image").classList.add("image" + size);
	document.getElementById("image").innerHTML = canvascontent1;
}

createPaintfield(32);

document.body.onmousedown = function() {
	mouseDown = 1;
}
document.body.onmouseup = function() {
	mouseDown = 0;
}

function paint(thepixel) {
	if(mouseDown){
		thepixel.style.backgroundColor = color;
	}
}

function paint1(thepixel) {
	thepixel.style.backgroundColor = color;
}

function generateColorSelect() {
	let colors = ["#fff","#000","#555", "#bbb", "#f00", "#909", "#faf", "#f0f", "#fa0", "#ff0", "#731", "#f70", "#070", "#7a1", "#0f0", "#0ff", "#00f", "#07f", "#77a", "#a77", "#7a7", "#9aa"];
	for(color of colors) {
		document.getElementById("colorselect").innerHTML += `
			<button class="color" style="background-color: ${color}" onclick="clr('${color}')"></button>
		`;
	}
}

generateColorSelect();

function clr(clr) {
	color = clr;
	document.getElementById("currentcolor").style.backgroundColor = color;
}

clr("#000");
