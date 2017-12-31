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

  renderer: null,

  tile_code_to_nickname: {
    0: "wall",
    1: "road",
    2: "grass",
    3: "sky"
  },

  drawBattlefield: function() {
    //Draws all of the graphics for the battlefield.

    // First get all of the tile locations.
    tile_info = battlefield.getTerrainTileInfo();

    // Render the tiles.
    battlefield.renderer.drawBattlefield(
      tile_info,
      {
        'xcoord': -50,
        'ycoord': -30,
      }
    );
  },

  getTerrainTileInfo: function() {
    // Returns a list of objects that indicate the tiles that make up the terrain.
    // Each object contains these keys:
    //   xindex: horizontal position of tile
    //   yindex: vertical position of tile
    //   tile_image_name: nickname for the image.
    tile_info = [];
    tiles = battlefield.battlefield_tiles;
    tile_width = battlefield.tile_size;
    tiles.forEach(function(tile_code, index) {
      //Determine where the tile should be.
      xindex = (index % battlefield.battlefield_width);
      yindex = Math.floor(index / battlefield.battlefield_width);

      tile_nickname = battlefield.tile_code_to_nickname[tile_code];

      // Add all information.
      tile_info.push({
        'xindex': xindex,
        'yindex': yindex,
        'tile_image_name': tile_nickname,
      });
    });
    return tile_info;
  }
}
