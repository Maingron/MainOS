var score = 0;
var automa = 0;
var time = 30;

var key, gameheight, gamewidth;

var player1 = document.getElementById("player1");
var player2 = document.getElementById("player2");
var player3 = document.getElementById("player3");
var player4 = document.getElementById("player4");
var berry1 = document.getElementById("berry1");
var berry2 = document.getElementById("berry2");
var berry3 = document.getElementById("berry3");
var berry4 = document.getElementById("berry4");


document.addEventListener('keydown', (event) => {
    key = event.key;
    gameheight = document.getElementById("field").offsetHeight;
    gamewidth = document.getElementById("field").offsetWidth;
    if (key == 'ArrowRight' || key == 'd') {
        if (player1.offsetLeft >= gamewidth - 80) {} else {
            player1.style.left = player1.offsetLeft + 40 + "px";
        }
    }
    if (key == 'ArrowLeft' || key == 'a') {
        if (player1.offsetLeft <= 0) {} else {
            player1.style.left = player1.offsetLeft - 40 + "px";
        }
    }
    if (key == 'ArrowUp' || key == 'w') {
        if (player1.offsetTop <= 0) {} else {
            player1.style.top = player1.offsetTop - 40 + "px";
        }
    }
    if (key == 'ArrowDown' || key == 's') {
        if (player1.offsetTop >= gameheight - 80) {} else {
            player1.style.top = player1.offsetTop + 40 + "px";
        }
    }

	if (key == '#') {
        automatic()
    }
    if (key == '-') {
        if (time < 5) {} else {
            time = time - 1;
        }
    }
    if (key == '+') {
        time = time + 1;
    }
    if (key == 'h') {
		document.body.classList.add("hide");
    }
    if (key == 'j') {
		document.body.classList.remove("hide");
    }

	updatePlayer(player1, berry1);

});


function automatic() {
    if (!automa) {
        automa++;
        player1.style.display = "inline";
        player2.style.display = "inline";
        player3.style.display = "inline";
        player4.style.display = "inline";
        berry1.style.display = "inline";
        berry2.style.display = "inline";
        berry3.style.display = "inline";
        berry4.style.display = "inline";

        setInterval(function () {
			updatePlayer(player1, berry1);
			updatePlayer(player2, berry2);
			updatePlayer(player3, berry3);
			updatePlayer(player4, berry4);
        }, time);
    }
}


function updatePlayer(whichplayer, whichberry) {
	whichplayer.top = whichplayer.offsetTop;
	whichplayer.left = whichplayer.offsetLeft;
	whichberry.top = whichberry.offsetTop;
	whichberry.left = whichberry.offsetLeft;

	if(automa) {
		if (whichberry.top < whichplayer.top) {
			whichplayer.style.top = whichplayer.offsetTop - 40 + "px";
		}
		if (whichberry.top > whichplayer.top) {
			whichplayer.style.top = whichplayer.offsetTop + 40 + "px";
		}
		if (whichberry.left < whichplayer.left) {
			whichplayer.style.left = whichplayer.offsetLeft - 40 + "px";
		}
		if (whichberry.left > whichplayer.left) {
			whichplayer.style.left = whichplayer.offsetLeft + 40 + "px";
		}
	}


	whichplayer.left = whichplayer.offsetLeft;
	whichplayer.top = whichplayer.offsetTop;

	if (whichplayer.left == whichberry.left && whichplayer.top == whichberry.top) {
		updateScore(whichberry);
	}
}

function updateScore(berry) {
	score++;
	document.getElementById("score").innerHTML = score;

	var randomtop = Math.floor(Math.random() * 1000) * 40;
	while (randomtop > gameheight - 80) {
		randomtop = Math.floor(Math.random() * 1000) * 40;
	}
	berry.style.top = randomtop + "px";

	var randomleft = Math.floor(Math.random() * 1000) * 40;
	while (randomleft > gamewidth - 80) {
		randomleft = Math.floor(Math.random() * 1000) * 40;
	}
	berry.style.left = randomleft + "px";
}