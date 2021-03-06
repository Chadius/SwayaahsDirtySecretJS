window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvas_context = canvas.getContext('2d');

  var background_color = "hsl(288, 10%, 15%)";
  colorRect(0,0,canvas.width,canvas.height, background_color);
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
  battlefield.handleInput(
    inputHandler,
    {
      "width": canvas.width,
      "height": canvas.height,
    },
  );

  inputHandler.resetInputFlags();
  //blueCar.move();
  //greenCar.move();
}

function drawAll() {
  battlefield.drawBattlefield();
  //drawTracks();
  //blueCar.draw();
  //greenCar.draw();
}
