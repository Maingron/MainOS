var automa = 0;
var time = 30;

var key, gameheight, gamewidth;

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


        document.styleSheets[0].insertRule(`
        #player${i},
        #berry${i},
        #counter${i} {
            --playercolor: ${randomColorGenerator()};
        }`);
    }

}

init();

document.addEventListener('keydown', (event) => {
    key = event.key;
    gameheight = document.getElementById("field").offsetHeight;
    gamewidth = document.getElementById("field").offsetWidth;
    if (key == 'ArrowRight' || key == 'd') {
        if (players[0].offsetLeft >= gamewidth - 80) {} else {
            players[0].style.left = players[0].offsetLeft + 40 + "px";
        }
    }
    if (key == 'ArrowLeft' || key == 'a') {
        if (players[0].offsetLeft <= 0) {} else {
            players[0].style.left = players[0].offsetLeft - 40 + "px";
        }
    }
    if (key == 'ArrowUp' || key == 'w') {
        if (players[0].offsetTop <= 0) {} else {
            players[0].style.top = players[0].offsetTop - 40 + "px";
        }
    }
    if (key == 'ArrowDown' || key == 's') {
        if (players[0].offsetTop >= gameheight - 80) {} else {
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
        updateScore(playerID);
    }
}

function updateScore(playerID) {
    berry = berries[playerID];
    score = scores[playerID];
    counter = counters[playerID];

    if(!scores[playerID]) {
        scores[playerID] = 0;
    }

    scores[playerID]++;

    counter.innerText = scores[playerID];

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


function randomColorGenerator() {
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
}