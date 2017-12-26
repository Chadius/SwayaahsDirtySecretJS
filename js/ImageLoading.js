var grass_tile_img = document.createElement("img");

var picsToLoad = 0;

function countLoadedImagesAndLaunchIfReady() {
  picsToLoad --;
  if (picsToLoad == 0) {
    imageLoadingDoneSoStartGame();
  }
}

function beginLoadingImage (imgVar, fileName) {
  imgVar.onload = countLoadedImagesAndLaunchIfReady;
  imgVar.src = "images/" + fileName;
}

function loadImages() {
  var imageList = [
    {varName: grass_tile_img, theFile: "Green Tile.png"}
  ];

  picsToLoad = imageList.length;
  for(var i=0; i<imageList.length; i++) {
    beginLoadingImage(imageList[i].varName, imageList[i].theFile);
  }
}
