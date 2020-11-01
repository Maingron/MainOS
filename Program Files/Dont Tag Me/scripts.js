score = 0;
var automa = "0";
var time = 30;
document.addEventListener('keydown', (event) => {
	var berrytop = document.getElementById("berry").offsetTop;
	var berryleft = document.getElementById("berry").offsetLeft;
	key = event.key;
	be = document.getElementById("be");
	gameheight = document.getElementById("ah").offsetHeight;
	gamewidth = document.getElementById("ah").offsetWidth;
	if(key == 'ArrowRight') {if(be.offsetLeft >= gamewidth - 80) {} else {be.style.left = be.offsetLeft + 40 + "px";}}
	if(key == 'ArrowLeft') {if(be.offsetLeft <= 0) {} else {be.style.left = be.offsetLeft - 40 + "px";}}
	if(key == 'ArrowUp') {if(be.offsetTop <= 0) {} else {be.style.top = be.offsetTop - 40 + "px";}}
	if(key == 'ArrowDown') {if(be.offsetTop >= gameheight - 80) {} else {be.style.top = be.offsetTop + 40 + "px";}}
	if(key == '#') {automatic()}
	if(key == '-') {if(time < 5) {} else {time = time - 1;}}
	if(key == '+') {time = time + 1;}
	if(key == 'z') {score = score - .58;}
	if(key == 'h') {
		be.style.opacity = "0"; 
		bet.style.opacity = "0"; 
		beth.style.opacity = "0"; 
		bothh.style.opacity = "0"; 
		berry.style.border = "4px solid blue"
		betrry.style.border = "4px solid blue";
		bethrry.style.border = "4px solid blue";
		bothhrry.style.border = "4px solid blue";
	}
	if(key == 'j') {
		be.style.opacity = "1"; 
		bet.style.opacity = ""; 
		beth.style.opacity = ""; 
		bothh.style.opacity = ""; 
		berry.style.border = ""
		betrry.style.border = "";
		bethrry.style.border = "";
		bothhrry.style.border = "";
	}
	var beleft = be.offsetLeft;
	var betop = be.offsetTop;
	if(beleft == berryleft && betop == berrytop) { 
		score++;
		document.getElementById("score").innerHTML = score;
		var randomtop = Math.floor(Math.random() * 1000) * 40;
		while(randomtop > gameheight - 80) {var randomtop = Math.floor(Math.random() * 1000) * 40;}
		berry.style.top = randomtop + "px";
		var randomleft = Math.floor(Math.random() * 1000) * 40;
		while(randomleft > gamewidth - 80) {var randomleft = Math.floor(Math.random() * 1000) * 40;}
		berry.style.left = randomleft + "px";

	}
});

function automatic() {
	if(automa != "1") {
	automa = "1";
	be = document.getElementById("be");
	bet = document.getElementById("bet");
	beth = document.getElementById("beth");
	bothh = document.getElementById("bothh");
	betrry = document.getElementById("betrry"); 
	bethrry = document.getElementById("bethrry");
	bothhrry = document.getElementById("bothhrry");
	be.style.display = "inline";
	bet.style.display = "inline";
	beth.style.display = "inline";
	bothh.style.display = "inline";
	betrry.style.display = "inline";
	bethrry.style.display = "inline";
	bothhrry.style.display = "inline";

	setInterval(function(){ 
	var berrytop = document.getElementById("berry").offsetTop;
	var berryleft = document.getElementById("berry").offsetLeft;
	var beleft = be.offsetLeft;
	var betop = be.offsetTop;
	if(berrytop < betop) {be.style.top = be.offsetTop - 40 + "px";}
	if(berrytop > betop) {be.style.top = be.offsetTop + 40 + "px";}
	if(berryleft < beleft) {be.style.left = be.offsetLeft - 40 + "px";}
	if(berryleft > beleft) {be.style.left = be.offsetLeft + 40 + "px";}


	var beleft = be.offsetLeft;
	var betop = be.offsetTop;
	if(beleft == berryleft && betop == berrytop) { 
		score++;
		document.getElementById("score").innerHTML = score;
		var randomtop = Math.floor(Math.random() * 1000) * 40;
		while(randomtop > gameheight - 80) {var randomtop = Math.floor(Math.random() * 1000) * 40;}
		berry.style.top = randomtop + "px";
		var randomleft = Math.floor(Math.random() * 1000) * 40;
		while(randomleft > gamewidth - 80) {var randomleft = Math.floor(Math.random() * 1000) * 40;}
		berry.style.left = randomleft + "px";
	}


	var betrrytop = document.getElementById("betrry").offsetTop;
	var betrryleft = document.getElementById("betrry").offsetLeft;
	var betleft = bet.offsetLeft;
	var bettop = bet.offsetTop;

	if(betrrytop < bettop) {bet.style.top = bet.offsetTop - 40 + "px";}
	if(betrrytop > bettop) {bet.style.top = bet.offsetTop + 40 + "px";}
	if(betrryleft < betleft) {bet.style.left = bet.offsetLeft - 40 + "px";}
	if(betrryleft > betleft) {bet.style.left = bet.offsetLeft + 40 + "px";}


	var betleft = bet.offsetLeft;
	var bettop = bet.offsetTop;
	if(betleft == betrryleft && bettop == betrrytop) { 
		score++;
		document.getElementById("score").innerHTML = score;
		var randomtop = Math.floor(Math.random() * 1000) * 40;
		while(randomtop > gameheight - 80) {var randomtop = Math.floor(Math.random() * 1000) * 40;}
		betrry.style.top = randomtop + "px";
		var randomleft = Math.floor(Math.random() * 1000) * 40;
		while(randomleft > gamewidth - 80) {var randomleft = Math.floor(Math.random() * 1000) * 40;}
		betrry.style.left = randomleft + "px";}


	var bethrrytop = document.getElementById("bethrry").offsetTop;
	var bethrryleft = document.getElementById("bethrry").offsetLeft;
	var bethleft = beth.offsetLeft;
	var bethtop = beth.offsetTop;

	if(bethrrytop < bethtop) {beth.style.top = beth.offsetTop - 40 + "px";}
	if(bethrrytop > bethtop) {beth.style.top = beth.offsetTop + 40 + "px";}
	if(bethrryleft < bethleft) {beth.style.left = beth.offsetLeft - 40 + "px";}
	if(bethrryleft > bethleft) {beth.style.left = beth.offsetLeft + 40 + "px";}


	var bethleft = beth.offsetLeft;
	var bethtop = beth.offsetTop;
	if(bethleft == bethrryleft && bethtop == bethrrytop) { 
		score++;
		document.getElementById("score").innerHTML = score;
		var randomtop = Math.floor(Math.random() * 1000) * 40;
		while(randomtop > gameheight - 80) {var randomtop = Math.floor(Math.random() * 1000) * 40;}
		bethrry.style.top = randomtop + "px";
		var randomleft = Math.floor(Math.random() * 1000) * 40;
		while(randomleft > gamewidth - 80) {var randomleft = Math.floor(Math.random() * 1000) * 40;}
		bethrry.style.left = randomleft + "px";

}


	var bothhrrytop = document.getElementById("bothhrry").offsetTop;
	var bothhrryleft = document.getElementById("bothhrry").offsetLeft;
	var bothhleft = bothh.offsetLeft;
	var bothhtop = bothh.offsetTop;

	if(bothhrrytop < bothhtop) {bothh.style.top = bothh.offsetTop - 40 + "px";}
	if(bothhrrytop > bothhtop) {bothh.style.top = bothh.offsetTop + 40 + "px";}
	if(bothhrryleft < bothhleft) {bothh.style.left = bothh.offsetLeft - 40 + "px";}
	if(bothhrryleft > bothhleft) {bothh.style.left = bothh.offsetLeft + 40 + "px";}


	var bothhleft = bothh.offsetLeft;
	var bothhtop = bothh.offsetTop;
	if(bothhleft == bothhrryleft && bothhtop == bothhrrytop) { 
		score++;
		document.getElementById("score").innerHTML = score;
		var randomtop = Math.floor(Math.random() * 1000) * 40;
		while(randomtop > gameheight - 80) {var randomtop = Math.floor(Math.random() * 1000) * 40;}
		bothhrry.style.top = randomtop + "px";
		var randomleft = Math.floor(Math.random() * 1000) * 40;
		while(randomleft > gamewidth - 80) {var randomleft = Math.floor(Math.random() * 1000) * 40;}
		bothhrry.style.left = randomleft + "px";
		}









	},time);}}
