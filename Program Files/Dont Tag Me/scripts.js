var automa = 0;
var time = 30;

var key, gameheight, gamewidth, gameheightminus80, gamewidthminus80, gameheightminus40, gamewidthminus40, gameheightminus40by40, gamewidthminus40by40, randomtop, randomleft;

var config = c = {
    maxPlayers: 6
}

var players = [];
var berries = [];
var counters = [];
var scores = [];

const field = document.getElementById("field");
const counterDiv = document.getElementById("counterDiv");
var counter;

function init() {

    for(var i = 0; i < config.maxPlayers; i++) {
        let newPlayer = document.createElement("div");
        newPlayer.id = `player${i}`;
        newPlayer.className = "player";
        field.appendChild(newPlayer);
        players.push(document.getElementById(`player${i}`));

        let newBerry = document.createElement("div");
        newBerry.id = `berry${i}`;
        newBerry.className = "berry";
        field.appendChild(newBerry);
        berries.push(document.getElementById(`berry${i}`));

        let newCounter = document.createElement("p");
        newCounter.id = `counter${i}`;
        newCounter.className = "counter"
        newCounter.innerHTML = 0;
        counterDiv.appendChild(newCounter);
        counters.push(document.getElementById(`counter${i}`));

        scores.push(0);

        document.styleSheets[0].insertRule(`
        #player${i},
        #berry${i},
        #counter${i} {
            --playercolor: ${randomColorGenerator()};
        }`);
        onResize();
    }

}

init();

document.addEventListener('keydown', (event) => {
    key = event.key;
    if (key == 'ArrowRight' || key == 'd') {
        if (players[0].offsetLeft >= gamewidthminus80) {} else {
            players[0].style.left = players[0].offsetLeft + 40 + "px";
        }
    }
    if (key == 'ArrowLeft' || key == 'a') {
        if (players[0].offsetLeft < 1) {} else {
            players[0].style.left = players[0].offsetLeft - 40 + "px";
        }
    }
    if (key == 'ArrowUp' || key == 'w') {
        if (players[0].offsetTop < 1) {} else {
            players[0].style.top = players[0].offsetTop - 40 + "px";
        }
    }
    if (key == 'ArrowDown' || key == 's') {
        if (players[0].offsetTop >= gameheightminus80) {} else {
            players[0].style.top = players[0].offsetTop + 40 + "px";
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

    updatePlayer(0);

});


function automatic() {
    if (!automa) {
        automa++;
        document.body.classList.add("isAutomatic");

        setInterval(function () {
            for(var i = 0; i < players.length; i++) {
                updatePlayer(i);
            }
        }, time);
    }
}


function updatePlayer(playerID) {
    var whichplayer = players[playerID];
    var whichberry = berries[playerID];

    if(automa) { // AI
        if (whichberry.offsetTop < whichplayer.offsetTop) {
            whichplayer.style.top = whichplayer.offsetTop - 40 + "px";
        } else if (whichberry.offsetTop > whichplayer.offsetTop) {
            whichplayer.style.top = whichplayer.offsetTop + 40 + "px";
        }
        if (whichberry.offsetLeft < whichplayer.offsetLeft) {
            whichplayer.style.left = whichplayer.offsetLeft - 40 + "px";
        } else if (whichberry.offsetLeft > whichplayer.offsetLeft) {
            whichplayer.style.left = whichplayer.offsetLeft + 40 + "px";
        }
    }

    if (whichplayer.offsetLeft == whichberry.offsetLeft && whichplayer.offsetTop == whichberry.offsetTop) {
        updateScore(playerID);
    }
}

function updateScore(playerID) {
    scores[playerID]++;

    counters[playerID].innerText = scores[playerID];

    randomtop = Math.floor(Math.random() * gameheightminus40by40) * 40;
    randomleft = Math.floor(Math.random() * gamewidthminus40by40) * 40;

    berries[playerID].style.top = randomtop + "px";
    berries[playerID].style.left = randomleft + "px";
}


function randomColorGenerator() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

window.addEventListener("resize", function() {
    onResize();
});

function onResize() {
    gameheight = document.getElementById("field").offsetHeight;
    gamewidth = document.getElementById("field").offsetWidth;
    gameheightminus80 = gameheight - 80;
    gamewidthminus80 = gamewidth - 80;
    gameheightminus40 = gameheight - 40;
    gamewidthminus40 = gamewidth - 40;
    gameheightminus40by40 = gameheightminus40 / 40;
    gamewidthminus40by40 = gamewidthminus40 / 40;
}