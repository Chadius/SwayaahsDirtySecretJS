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

  start_date: null,

  tile_code_to_nickname: {
    0: "wall",
    1: "single",
    2: "double",
    3: "passthrough"
  },

  camera: {
    'xcoord': 0,
    'ycoord': 0
  },

  drawBattlefield: function() {
    //Draws all of the graphics for the battlefield.

    // First get all of the tile locations.
    tile_info = battlefield.getTerrainTileInfo();

    // Render the tiles.
    battlefield.renderer.drawBattlefield(
      tile_info['tile_texture'],
      battlefield.camera,
      tile_info['size']
    );

    // Draw the tile the mouse is hovering over.
    battlefield.renderer.drawHighlightedTiles(
      battlefield.camera,
      battlefield.start_time
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

  handleInput: function(input_state, screen_dimensions) {
    /* interpret the input state. */
    mouseX = input_state.mouseX;
    mouseY = input_state.mouseY;

    // Tell the renderer where the mouse is so it can update its context.
    battlefield.renderer.update_mouse_location(
      mouseX,
      mouseY,
      battlefield.camera,
      battlefield.battlefield_width,
      battlefield.battlefield_tiles.length
    );

    // Move the camera if necessary.
    new_camera = battlefield.renderer.get_new_camera_position(
      {
        "xcoord": battlefield.camera['xcoord'],
        "ycoord": battlefield.camera['ycoord']
      },
      {
        "mouseX": mouseX,
        "mouseY": mouseY
      },
      screen_dimensions,
      battlefield.battlefield_width,
      battlefield.battlefield_tiles.length
    );
    battlefield.camera['xcoord'] = new_camera['x'];
    battlefield.camera['ycoord'] = new_camera['y'];
  }
}
