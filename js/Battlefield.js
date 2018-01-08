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
    1: "single",
    2: "double",
    3: "passthrough"
  },

  drawBattlefield: function() {
    //Draws all of the graphics for the battlefield.

    // First get all of the tile locations.
    tile_info = battlefield.getTerrainTileInfo();

    // Render the tiles.
    battlefield.renderer.drawBattlefield(
      tile_info['tile_texture'],
      {
        'xcoord': -100,
        'ycoord': -100,
      },
      tile_info['size']
    );
  },

  getTerrainTileInfo: function() {
    // Returns a list of objects that indicate the tiles that make up the terrain.
    // Each object contains these keys:
    //   xindex: horizontal position of tile
    //   yindex: vertical position of tile
    //   tile_image_name: nickname for the image.
    tile_info = {
      'size':{},
      'tile_texture':[],
      'tile_movement':[]
    };
    tiles = battlefield.battlefield_tiles;
    tile_width = 0;
    tile_height = 0;
    tiles.forEach(function(tile_code, index) {
      //Determine where the tile should be.
      xindex = (index % battlefield.battlefield_width);
      yindex = Math.floor(index / battlefield.battlefield_width);

      tile_nickname = battlefield.tile_code_to_nickname[tile_code];

      if (xindex >= tile_width) {
        tile_width = xindex + 1;
      }

      if (yindex >= tile_height) {
        tile_height = yindex + 1;
      }

      // Add all information.
      tile_info['tile_texture'].push({
        'xindex': xindex,
        'yindex': yindex,
        'tile_image_name': tile_nickname,
      });

      tile_info['tile_movement'].push({
        'xindex': xindex,
        'yindex': yindex,
        'tile_image_name': tile_nickname,
      });
    });

    // Add the overall dimensions of the battlefield.
    tile_info['size']['width'] = tile_width;
    tile_info['size']['height'] = tile_height;
    return tile_info;
  },

  handleInput: function(input_state) {
    /* interpret the input state. */
    mouseX = input_state.mouseX;
    mouseY = input_state.mouseY;

    // Ask the renderer what the mouse is hovering on top of.
    //battlefield.renderer.interpret_mouse_location(mouseX, mouseY);

    // Parse the return value to understand what it clicked on.
    // For now we just need the location.

    // Once we've parsed the situation, tell the web renderer what to do.
    battlefield.renderer.update_mouse_location(mouseX, mouseY, battlefield_width, battlefield_tiles.length);
  }
}
