var canvas = document.getElementById("image");
var canvascontent1 = canvas.innerHTML;
var mouseDown = 0;

for(i=0;i<256;i++) {
  canvascontent1 = canvascontent1 + "<button onmousedown='paint1(this)' onclick='paint1(this)' onmouseover='paint(this)'></button>";
}

canvas.innerHTML = canvascontent1;

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

function clr(clr) {
	color = clr;
	document.getElementById("currentcolor").style.backgroundColor = color;

}
var color="#000";
