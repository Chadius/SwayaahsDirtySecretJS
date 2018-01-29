/*
battlefield renders the battlefield to the screen.
*/

var battlefield_web_render = {
  tile_size: 96,

  tile_to_image_mapping: {},

  finished_loading_images: false,
  pending_required_images_count: 0,
  screen_dimensions: {'width':null, 'height':null},

  tile_image_database: {
    "wall": {
      filename: "Wall Tile.png",
      tile_to_image_mapping_key: "wall",
      nickname: "wall"
    },
    "grass": {
      filename: "Green Tile.png",
      tile_to_image_mapping_key: "grass",
      nickname: "grass"
    },
    "sky": {
      filename: "Sky Tile.png",
      tile_to_image_mapping_key: "sky",
      nickname: "sky"
    },
    "road": {
      filename: "Road Tile.png",
      tile_to_image_mapping_key: "road",
      nickname: "road"
    },
    "single": {
      filename: "default_move_tile.png",
      tile_to_image_mapping_key: "single",
      nickname: "single"
    },
    "double": {
      filename: "double_tile.png",
      tile_to_image_mapping_key: "double",
      nickname: "double"
    },
    "passthrough": {
      filename: "pass_through_tile.png",
      tile_to_image_mapping_key: "passthrough",
      nickname: "passthrough"
    }
  },

  mouse_location: {
    "mouseX": -1,
    "mouseY": -1
  },

  tile_hover: {
    "currently_hovering": false,
    "column": -1,
    "row": -1,
    "index": -1
  },

  loadRequiredImages: function() {
    // These are images that MUST be loaded before displaying anything to the user.
    var name_to_file_mapping = [];
    var tile_set = ["single", "double", "passthrough", "wall"];

    // For the tileset, associate the image filename to the each tile.
    tile_set.forEach(function(tilename){
      var_name = tilename;
      the_file = battlefield_web_render.tile_image_database[tilename].filename;

      name_to_file_mapping.push(
        {var_name: var_name, the_file: the_file}
      );
    });

    // Now load the images.
    new_images = image_loading.loadRequiredImagesForObject(
      name_to_file_mapping,
      battlefield_web_render
    );

    // Associate the loaded images to each tile.
    tile_set.forEach(function(tilename){
      tile_to_image_mapping_key = battlefield_web_render.tile_image_database[tilename].tile_to_image_mapping_key;
      nickname = battlefield_web_render.tile_image_database[tilename].nickname;

      battlefield_web_render.tile_to_image_mapping[tile_to_image_mapping_key] = new_images[nickname];
    });
  },

  drawBattlefield: function(tile_drawing_information, camera_position, battlefield_size) {
    //Draws all of the given tiles on the field.
    // tile_drawing_information: A list of objects. Objects should have these keys
    // camera_position: The upperleft corner of the camera with xcoord and ycoord properties.
    // battlefield_size: An object that has the width and height of the battlefield (in tiles)

    battlefield_web_render._drawBattlefieldBackground();

    // Draw the battlefield shadow.
    battlefield_web_render._drawBattlefieldShadow(camera_position, battlefield_size);

    // Now Draw the tiles.
    battlefield_web_render._drawBattlefieldTiles(tile_drawing_information, camera_position);

    // Draw the mouse coordinates.
    mouseX = battlefield_web_render.mouse_location["mouseX"];
    mouseY = battlefield_web_render.mouse_location["mouseY"];
    colorText("("+ mouseX + ", "+ mouseY +")", canvas.width - 100, canvas.height * 0.95, "hsl(0,100%,100%)");
  },

  _drawBattlefieldBackground: function() {
    // Draws the background.
    var background_color = "hsl(288, 10%, 15%)";
    colorRect(
      0,
      0,
      battlefield_web_render.screen_dimensions.width,
      battlefield_web_render.screen_dimensions.height,
      background_color
    );
  },

  _drawBattlefieldShadow: function(camera_position, battlefield_size) {
    // Draws a shadow that the battlefield will be contained within.
    // camera_position: The upperleft corner of the camera with xcoord and ycoord properties.
    // battlefield_size: An object that has the width and height of the battlefield (in tiles)

    // Record the size of the tiles.
    tile_size = battlefield_web_render.tile_size;
    half_tile_size = 0.5 * battlefield_web_render.tile_size;

    // The upperleft corner of the shadow should be half a tile back.
    shadow_left = 0 - camera_position.xcoord - half_tile_size;
    shadow_top = 0 - camera_position.ycoord - half_tile_size;

    // The width should be one tile width away from the right most tile.
    // This is a hex grid, so even rows are pushed half a tile outward.
    shadow_width = battlefield_size['width'] * tile_size + tile_size + half_tile_size;

    // The height of the shadow should be one tile height more than the battlefield's height.
    shadow_height = battlefield_size['height'] * tile_size + tile_size;

    // Get the color for the shadow- A transparent black.
    var shadow_color = "hsla(288, 0%, 50%, 0.5)";

    // Draw a shadow for the battlefield.
    colorRect(shadow_left, shadow_top, shadow_width, shadow_height, shadow_color);
  },

  _drawBattlefieldTiles: function(tile_drawing_information, camera_position) {
    // Draws all of the given tiles on the field.
    // tile_drawing_information: A list of objects. Objects should have these keys
    //   xindex: horizontal position of tile
    //   yindex: vertical position of tile
    //   tile_image_name: nickname for the image.
    // camera_position: The upperleft corner of the camera with xcoord and ycoord properties.
    battlefield_web_render._genericTileDraw(
      tile_drawing_information,
      camera_position,
      battlefield_web_render._drawSingleBattlefieldTile
    );
  },

  _genericTileDraw: function (
    tile_drawing_information,
    camera_position,
    draw_function
  ) {
    /* This function is designed to draw tiles.
     tile_drawing_information: A list of objects. Objects should have these keys
       xindex: horizontal position of tile
       yindex: vertical position of tile
       (Other keys can be added for the particular function)
     camera_position: The upperleft corner of the camera with xcoord and ycoord properties.
     draw_function: This function will be called for each tile contained in tile_drawing_information. It will be called with:
       xcoord: The horizontal location on screen of the left side of the tile.
       ycoord: The vertical location on screen of the top side of the tile.
       drawing_information: The corresponding object in tile_drawing_information
    */

    // Get the tile size
    tile_size = battlefield_web_render.tile_size;

    // For each tile
    tile_drawing_information.forEach(function(info) {
      // Convert x & y indecies to pixel based coordinates.
      xindex = info['xindex'];
      yindex = info['yindex'];

      xcoord = xindex * tile_size;
      ycoord = yindex * tile_size;

      xcoord -= camera_position.xcoord;
      ycoord -= camera_position.ycoord;

      // This is a hex grid, so add an offset to every other line.
      if (yindex % 2 == 1) {
        xcoord += tile_size / 2;
      }

      // Now pass this along to the draw function.
      draw_function(xcoord, ycoord, info);
    });
  },

  _drawSingleBattlefieldTile: function(xcoord, ycoord, drawing_info) {
    /* Draws a single tile.
    */

    //Get the image to draw on this tile.
    image_mapping = battlefield_web_render.tile_to_image_mapping;
    tile_to_draw = image_mapping[drawing_info["tile_image_name"]];

    //Now draw the image.
    canvas_context.drawImage(tile_to_draw, xcoord, ycoord);
  },

  updateMouseLocation: function(
    mouseX,
    mouseY,
    mouse_button_info,
    camera_position,
    battlefield_width,
    battlefield_tile_count
  ) {
    /*
    mouseX: x location of the mouse relative to the screen.
    mouseY: y location of the mouse relative to the screen.
    mouse_button_info: object containing the keys: button_is_up, button_is_down and button_pressed
    camera_position:
    battlefield_width:
    battlefield_tiles:
    */
    battlefield_web_render.mouse_location = {
      "mouseX": mouseX,
      "mouseY": mouseY
    };

    battlefield_web_render.tile_hover = {
      "currently_hovering": false,
      "column": -1,
      "row": -1,
      "index": -1
    };

    // Which tile is the mouse hovering over?
    // First figure out if it's on the battlefield.
    mouse_field_x = mouseX + camera_position.xcoord;
    mouse_field_y = mouseY + camera_position.ycoord;

    // Get the battlefield dimensions.
    battlefield_pixel_size = battlefield_web_render._getMapPixelDimensions(
      battlefield_width, battlefield_tile_count);

    battlefield_pixel_width = battlefield_pixel_size["width"];
    battlefield_pixel_height = battlefield_pixel_size["height"];

    // If it isn't on the field, then it's not hovering.
    not_on_horizontal = (mouse_field_x < 0 || mouse_field_x > battlefield_pixel_width);
    not_on_vertical = (mouse_field_y < 0 || mouse_field_y > battlefield_pixel_height);

    if (not_on_vertical || not_on_horizontal) {
      battlefield_web_render.tile_hover = {
        "currently_hovering": false,
        "column": -1,
        "row": -1,
        "index": -1
      };
    }
    else {
      // Determine which row the cursor is on.
      tile_row = Math.floor(mouse_field_y / tile_size);

      // Now determine the column.
      tile_column = Math.floor(mouse_field_x / tile_size);

      // This is a hex grid, so every other row has an offset.
      if (tile_row % 2 == 1) {
        tile_column = Math.floor((mouse_field_x - half_tile_size) / tile_size);
      }

      // Get the index.
      tile_index = (tile_row * battlefield_width) + tile_column;

      // If the given tile doesn't exist, the tile isn't hovering.
      if (
        tile_index >= battlefield_tile_count
        || tile_column < 0
        || tile_row < 0
      ) {
        battlefield_web_render.tile_hover = {
          "currently_hovering": false,
          "column": -1,
          "row": -1,
          "index": -1
        };
      }
      else {
        // Update the variable.
        battlefield_web_render.tile_hover = {
          "currently_hovering": true,
          "column": tile_column,
          "row": tile_row,
          "index": tile_index
        };
      }
    }
  },

  _getMapPixelDimensions: function(battlefield_width, battlefield_tile_count) {
    /*
      Returns an object with "width" and "height" keys representing
      the size of the map in pixels.
    */

    tile_size = battlefield_web_render.tile_size;
    half_tile_size = tile_size / 2;
    battlefield_pixel_width = battlefield_width * tile_size;
    battlefield_pixel_height = Math.ceil(battlefield_tile_count / battlefield_width) * tile_size;

    return {
      "width": battlefield_pixel_width,
      "height": battlefield_pixel_height,
    }
  },

  getNewCameraPosition: function(current_camera_position, current_mouse_location,
    screen_dimensions, battlefield_width, battlefield_tile_count) {
    /* Returns an object with "x" and "y" keys that represents the new camera location.

    current_camera_position is an object with "xcoord" and "ycoord" keys
      representing what the upperleft corner of ths screen is pointing at.
    current_mouse_location is an object with "mouseX" and "mouseY" keys
      representing where the mouse is on screen.
    screen_dimensions: Object with "width" and "height" keys representing
      the overall dimensions of the screen.
    battlefield_width: The maximum number of tiles on the row.
    battlefield_tile_count: The total number of tiles in this map. Every line
      is filled with tiles except the final one, maybe.
    */

    new_camera_position = {
      "x": current_camera_position["xcoord"],
      "y": current_camera_position["ycoord"]
    };

    // Get the width and height of the map.
    battlefield_pixel_size = battlefield_web_render._getMapPixelDimensions(
      battlefield_width, battlefield_tile_count);

    battlefield_pixel_width = battlefield_pixel_size["width"];
    battlefield_pixel_height = battlefield_pixel_size["height"];

    // Scroll camera left if needed
    original_x = new_camera_position["x"];
    if (battlefield_web_render._canCameraScrollInDirection(
      "left",
      new_camera_position["x"],
      screen_dimensions["width"],
      battlefield_width,
      battlefield_tile_count
    )) {
      new_camera_position["x"] = battlefield_web_render._determineCameraScroll(
        original_x,
        screen_dimensions["width"],
        current_mouse_location["mouseX"],
        true,
        0.2
      );
    }
    // If you didn't scroll left, maybe scroll right
    if (new_camera_position["x"] == original_x) {
      if (battlefield_web_render._canCameraScrollInDirection(
        "right",
        new_camera_position["x"],
        screen_dimensions["width"],
        battlefield_width,
        battlefield_tile_count
      )) {
        new_camera_position["x"] = battlefield_web_render._determineCameraScroll(
          original_x,
          screen_dimensions["width"],
          current_mouse_location["mouseX"],
          false,
          0.2
        );
      }
    }

    // Scroll camera up if needed
    original_y = new_camera_position["y"];
    if (battlefield_web_render._canCameraScrollInDirection(
      "up",
      new_camera_position["y"],
      screen_dimensions["height"],
      battlefield_width,
      battlefield_tile_count
    )) {
      new_camera_position["y"] = battlefield_web_render._determineCameraScroll(
        original_y,
        screen_dimensions["height"],
        current_mouse_location["mouseY"],
        true,
        0.2
      );
    }
    // If you didn't scroll up, maybe scroll down
    if (battlefield_web_render._canCameraScrollInDirection(
      "down",
      new_camera_position["y"],
      screen_dimensions["height"],
      battlefield_width,
      battlefield_tile_count
    )) {
      if (new_camera_position["y"] == original_y) {
        new_camera_position["y"] = battlefield_web_render._determineCameraScroll(
          original_y,
          screen_dimensions["height"],
          current_mouse_location["mouseY"],
          false,
          0.2
        );
      }
    }

    return new_camera_position;
  },

  _determineCameraScroll: function(
    camera,
    screen_dimension,
    mouse,
    scroll_if_mouse_less_than_screen,
    scroll_threshold
  ) {
    /* Helper function returns the new location the camera should be at.
    camera: camera's location.
    screen_dimension: size of the relevant screen dimension
    mouse: mouse's location
    scroll_if_mouse_less_than_screen: if true, the mouse value should be less
      than the screen's value to trigger the scroll.
    scroll_threshold: This number indicates the fraction of the screen_size that
      will trigger the screen scroll
    */
    new_camera = camera;
    amount_past_screen_margin = 0;
    if (scroll_if_mouse_less_than_screen) {
      screen_margin = screen_dimension * scroll_threshold;
      amount_past_screen_margin = screen_margin - mouse;
      new_camera = camera - 5;
    }
    else {
      screen_margin = screen_dimension - (screen_dimension * scroll_threshold);
      amount_past_screen_margin = mouse - screen_margin;
      new_camera = camera + 5;
    }

    if (amount_past_screen_margin > 0) {
      return new_camera;
    }
    return camera;
  },

  _canCameraScrollInDirection: function(
    scroll_direction,
    camera,
    screen_dimension,
    battlefield_width,
    battlefield_tile_count
  ) {
    /*  Returns true if the camera can scroll in that direction.
        scroll_direction: string "up" "right" "down" "left"
        camera: camera's location on the scroll_direction's axis.
        screen_dimension: size of the relevant screen dimension
        battlefield_width: The maximum number of tiles on the row.
        battlefield_tile_count: The total number of tiles in this map. Every line
          is filled with tiles except the final one, maybe.
    */

    // Get the width and height of the map.
    battlefield_pixel_size = battlefield_web_render._getMapPixelDimensions(
      battlefield_width, battlefield_tile_count);

    battlefield_pixel_width = battlefield_pixel_size["width"];
    battlefield_pixel_height = battlefield_pixel_size["height"];

    // The battlefield should have at most a 1 tile size gap.
    // Depending on the direction, note the maximum camera direction.
    var camera_position_threshold = 0;
    var camera_should_be_less_than_threshold = false;
    var tile_size = battlefield_web_render.tile_size;

    switch (scroll_direction) {
      case "up":
        camera_position_threshold = -1 * tile_size;
        camera_should_be_less_than_threshold = false;
        break;
      case "right":
        camera_position_threshold = battlefield_pixel_width -screen_dimension - tile_size;
        camera_should_be_less_than_threshold = true;
        break;
      case "down":
        camera_position_threshold = battlefield_pixel_height - screen_dimension - tile_size;
        camera_should_be_less_than_threshold = true;
        break;
      case "left":
        camera_position_threshold = -1 * tile_size;
        camera_should_be_less_than_threshold = false;
        break;
      default:
        throw "battlefield_web_render._canCameraScrollInDirection: unknown direction " + scroll_direction;
        break;
      }
    // Keep scrolling if the camera has not exceeded the threshold.
    if (camera_should_be_less_than_threshold && camera < camera_position_threshold) {
      return true;
    }

    if (!camera_should_be_less_than_threshold && camera > camera_position_threshold) {
      return true;
    }

    // The camera is out of bounds. Stop scolling.
    return false;
  },

  drawHighlightedTiles: function(
    camera_position,
    start_date
  ) {
    /*
    Draws all of the highlighted tiles on the battlefield.
      camera_position: The upperleft corner of the camera with xcoord and ycoord properties.
      start_date: Date object.
    */

    tile_drawing_information = [];

    // Add the hover tile if needed
    if (battlefield_web_render.tile_hover["currently_hovering"]) {
      tile_drawing_information.push({
        'xindex': battlefield_web_render.tile_hover["column"],
        'yindex': battlefield_web_render.tile_hover["row"],
        'start_date': start_date
      });
    }

    battlefield_web_render._genericTileDraw(
      tile_drawing_information,
      camera_position,
      battlefield_web_render._drawHoverTile
    );
  },

  _drawHoverTile: function(xcoord, ycoord, drawing_info) {
    /* Draws an outline around the tile the selector is hovering over.

    drawing_info must have these key/value pairs:
      start_date: Date object.
    */
    tile_size = battlefield_web_render.tile_size;
    start_date = drawing_info['start_date'];

    // Vary the light level based on the number of milliseconds that passed.
    now = new Date();
    elapsed_milliseconds = now - start_date;
    light_level = '15%';
    if (isNaN(elapsed_milliseconds) == false) {
      light_level = (elapsed_milliseconds % 1000) / 10;
      light_level = light_level + "%";
    }

    var highlight_color = "hsl(350, 80%, " + light_level + ")";
    colorStrokeRect(xcoord, ycoord, tile_size, tile_size, highlight_color);
  },

}
