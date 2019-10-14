var MidiPlayer = MidiPlayer;
var loadSong, loadDataUri, Player;
var AudioContext = window.AudioContext || window.webkitAudioContext || false;
var ac = new AudioContext || new webkitAudioContext;

var changeTempo = function(tempo) {
  Player.tempo = tempo;
}

var play = function() {
  Player.play();
}

var pause = function() {
  Player.pause();
}

var stop = function() {
  Player.stop();
}

var buildTracksHtml = function() {
  Player.tracks.forEach(function(item, index) {
    var trackDiv = document.createElement('div');
    trackDiv.id = 'track-' + (index + 1);
    var h5 = document.createElement('h5');
    h5.innerHTML = 'Track ' + (index + 1);
    var code = document.createElement('code');
    trackDiv.appendChild(h5);
    trackDiv.appendChild(code);
    eventsDiv.appendChild(trackDiv);
  });
}

Soundfont.instrument(ac, 'soundfont.js').then(function(instrument) {

  loadSong = function(file) {
    var file = document.querySelector('input[type=file]').files[0];
    console.log(file);
    var reader = new FileReader();
    if (file) reader.readAsArrayBuffer(file);


    reader.addEventListener("load", function() {
      Player = new MidiPlayer.Player(function(event) {
        if (event.name == 'Note on') {
          instrument.play(event.noteName, ac.currentTime, {
            gain: event.velocity / 100
          });
        }

      });

      Player.loadArrayBuffer(reader.result);


      //buildTracksHtml();
      play();
    }, false);
  }

  loadDataUri = function(dataUri) {
    Player = new MidiPlayer.Player(function(event) {
      if (event.name == 'Note on' && event.velocity > 0) {
        instrument.play(event.noteName, ac.currentTime, {
          gain: event.velocity / 100
        });
        //document.querySelector('#track-' + event.track + ' code').innerHTML = JSON.stringify(event);
        //console.log(event);
      }
    });

    Player.loadDataUri(dataUri);

  }





});