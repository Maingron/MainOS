var path = window.parent.attr;

if (path) {
  console.log(path);
  Player.loadSong(parent.loadfile(path));
}