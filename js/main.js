window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var backgroundColor = "hsl(288, 10%, 15%)";
  colorRect(0,0,canvas.width,canvas.height, backgroundColor); //  hsl(288, 100%, 50%));
  colorText("Loading images", canvas.width/2, canvas.height/2, "white");

  loadImages();
}

function imageLoadingDoneSoStartGame() {
  var framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond);

  inputHandler.setupInput(canvas);
  //loadLevel(levelOne);
}

function loadLevel(whichLevel) {
  //trackGrid = whichLevel.slice();
}

function updateAll() {
  moveAll();
  drawAll();
}

function moveAll() {
  //blueCar.move();
  //greenCar.move();
}

function drawAll() {
  battlefield.drawBattlefield();
  //drawTracks();
  //blueCar.draw();
  //greenCar.draw();
}
