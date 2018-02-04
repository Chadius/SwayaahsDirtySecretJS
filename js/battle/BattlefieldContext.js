/*
battlefield context knows what the tiles and units are, where they are
located, and what they want to do next.
*/

var battlefield_context = {
  // The renderer draws objects on the screen.
  renderer: null,

  // The camera focuses on which objects to draw. It can also update the context.
  camera: null,

  // The input handler interprets the player's raw input.
  input: null,

  // Screen size. Object with width and height attributes
  screen_dimensions: null,

  //How wide is the battlefield?
  _width: 5,

  //Movement costs of each tile, and the visual display
  _tile_movement: [
    1,2,1,1,1,
     1,3,1,1,1,
    1,1,3,2,0
  ],

  _tileset_graphics: [
    1,2,1,1,1,
     1,3,1,1,1,
    1,1,3,2,0
  ],

  _tileset_code: {
    0: "wall",
    1: "single",
    2: "double",
    3: "passthrough"
  },

  setTiles: function (width, movement_tiles) {
    /* Sets the tiles used for this battle.

    width: How wide is each row?
    movement_tiles: A list containing The movement cost of each tile. Each entry
      is a single character.
      1: Single. Spend 1 movement to cross or stop.
      2: Double. Spend 2 movement to cross or stop.
      3: Passthrough. Spend 1 movement to cross. Cannot stop. Must be able to
        use Passthrough tiles.
      0: Wall. Cannot cross through or stop on.
    */

    // TODO: Verify width is positive.
    battlefield_context._width = width;

    // TODO: If there aren't enough, autofill so Walls fill up the final row.
    battlefield_context._tile_movement = movement_tiles;
  },

  getCameraPosition: function() {
    /* Returns the camera position as an object.
    */
    return battlefield_context.camera.getCameraLocation();
  },

  resetCamera: function (new_camera_x, new_camera_y) {
    /* Immediately snaps the camera to the new position.

    If coordinates are not given, snaps to (0,0)
    */
    battlefield_context.camera.snapToLocation(new_camera_x, new_camera_y);
  },

  resetInput: function () {
    /* Resets the tracked input variables. */
  },

  handleInput: function(player_input_controller) {
    /* The user may or may not have input. Process it as needed.
    player_input_controller should have these attributes
    */

    // Get the size of the battlefield.
    battlefield_pixel_size = battlefield_web_render._getMapPixelDimensions(
      battlefield_context.battlefield_width,
      battlefield_context._tile_movement.length);

    battlefield_pixel_width = battlefield_pixel_size["width"];
    battlefield_pixel_height = battlefield_pixel_size["height"];

    // Get the tile size.
    tile_size = battlefield_web_render.getTileSize();

    // Ask the camera to scroll.
    battlefield_camera.scrollCameraBasedOnMouse(
      player_input_controller.getMouseLocation(),
      battlefield_context.screen_dimensions,
      {
        width: battlefield_pixel_width,
        height: battlefield_pixel_height
      },
      tile_size
    );
  }
};

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
    mouse_button_clicked = input_state.button_clicked;

    // Tell the renderer where the mouse is so it can update its context.
    battlefield.renderer.updateMouseLocation(
      mouseX,
      mouseY,
      {
        mouse_button_clicked: mouse_button_clicked
      },
      battlefield.camera,
      battlefield.battlefield_width,
      battlefield.battlefield_tiles.length
    );

    // Move the camera if necessary.
    new_camera = battlefield.renderer.getNewCameraPosition(
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
