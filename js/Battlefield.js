/*
battlefield moves units and performs logic.
*/

var battlefield = {
  battlefield_width: 5,

  battlefield_tiles: [
    1,2,1,1,1,
     1,3,1,1,1,
    1,1,3,2,0
  ],

  tile_size: 96,

  tile_to_image_mapping: {},

  finished_loading_images: false,
  pending_required_images_count: 0,

  loadRequiredImages: function() {
    // These are images that MUST be loaded before displaying anything to the user.
    new_images = image_loading.loadRequiredImagesForObject(
      [
        {varName: "wall", theFile: "Wall Tile.png"},
        {varName: "grass", theFile: "Green Tile.png"},
        {varName: "road", theFile: "Road Tile.png"},
        {varName: "sky", theFile: "Sky Tile.png"}
      ],
      battlefield
    );
    battlefield.tile_to_image_mapping[0] = new_images["wall"];
    battlefield.tile_to_image_mapping[1] = new_images["grass"];
    battlefield.tile_to_image_mapping[2] = new_images["road"];
    battlefield.tile_to_image_mapping[3] = new_images["sky"];
  },

  drawBattlefield: function() {
    //Draws all of the tiles on the field.

    tiles = battlefield.battlefield_tiles;
    tile_width = battlefield.tile_size;
    image_mapping = battlefield.tile_to_image_mapping;
    tiles.forEach(function(tile_code, index) {
      //Determine where the tile should be.
      xindex = (index % battlefield.battlefield_width);
      yindex = Math.floor(index / battlefield.battlefield_width);

      //Determine where to draw the tile.
      xcoord = xindex * tile_width;
      ycoord = yindex * tile_width;

      // This is a hex grid. Offset every other line by half the width.
      if (yindex % 2 == 1) {
        xcoord += tile_width / 2;
      }

      //Get the image to draw on this tile.
      tile_to_draw = image_mapping[tile_code];

      //Now draw the image.
      canvasContext.drawImage(tile_to_draw, xcoord, ycoord);
    });
  }
}
