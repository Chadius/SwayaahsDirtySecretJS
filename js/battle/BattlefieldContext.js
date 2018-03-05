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

  // Just here for timing
  start_date: null,

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
    battlefield_input.reset();
  },

  handleInput: function(player_input_controller) {
    /* The user may or may not have input. Process it as needed.
    player_input_controller should have these attributes
    */

    // Get the size of the battlefield.
    battlefield_pixel_size = battlefield_web_render._getMapPixelDimensions(
      battlefield_context._width,
      battlefield_context._tile_movement.length);

    battlefield_pixel_width = battlefield_pixel_size["width"];
    battlefield_pixel_height = battlefield_pixel_size["height"];

    // Get the tile size.
    battlefield_tile_size = battlefield_web_render.getTileSize();

    mouse_screen_location = {
      x: player_input_controller.mouseX,
      y: player_input_controller.mouseY,
    };

    // Update the tile selections.
    battlefield_input.setMouse(mouse_screen_location);
    battlefield_input.updateTilesSelection(
      battlefield_camera.getCameraLocation(),
      {
        width: battlefield_pixel_width,
        height: battlefield_pixel_height
      },
      battlefield_tile_size,
      battlefield_context._width,
      battlefield_context._tile_movement.length
    );

    // Ask the camera to scroll.
    battlefield_camera.scrollCameraBasedOnMouse(
      mouse_screen_location,
      battlefield_context.screen_dimensions,
      {
        width: battlefield_pixel_width,
        height: battlefield_pixel_height
      },
      battlefield_tile_size
    );
  },

  getTileMouseHoversOver: function () {
    /* If the player is currently hovering over a battlefield tile,
    returns information on it.
    */

    // Ask the input to return the hovered tile.
    return battlefield_input.getTileMouseHoversOver();
  },

  getLastTileMouseHoversOver: function () {
    /* This returns the last tile the user hovered over.
    */

    // Ask the input to return the hovered tile.
    return battlefield_input.getLastTileMouseHoversOver();
  },

  drawBattlefield: function() {
    //Draws all of the graphics for the battlefield.

    // First get all of the tile locations.
    tile_info = battlefield_context.getTerrainTileInfo();

    // Render the tiles.
    battlefield_context.renderer.drawBattlefield(
      tile_info.tile_texture,
      battlefield_camera.getCameraLocation(),
      battlefield_input.getMouseLocation()
    );

    // Draw the tile the mouse is hovering over.
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
  }
};
