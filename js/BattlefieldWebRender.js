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

  mouseLocation: {
    "mouseX": -1,
    "mouseY": -1
  },

  tileHover: {
    "currently_hovering": false,
    "column": -1,
    "row": -1,
    "index": -1
  },

  loadRequiredImages: function() {
    // These are images that MUST be loaded before displaying anything to the user.
    var name_to_file_mapping = [];
    var tileSet = ["single", "double", "passthrough", "wall"];

    // For the tileset, associate the image filename to the each tile.
    tileSet.forEach(function(tilename){
      varName = tilename;
      theFile = battlefield_web_render.tile_image_database[tilename].filename;

      name_to_file_mapping.push(
        {varName: varName, theFile: theFile}
      );
    });

    // Now load the images.
    new_images = image_loading.loadRequiredImagesForObject(
      name_to_file_mapping,
      battlefield_web_render
    );

    // Associate the loaded images to each tile.
    tileSet.forEach(function(tilename){
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

    battlefield_web_render.drawBattlefieldBackground();

    // Draw the battlefield shadow.
    battlefield_web_render.drawBattlefieldShadow(camera_position, battlefield_size);

    // Now Draw the tiles.
    battlefield_web_render.drawBattlefieldTiles(tile_drawing_information, camera_position);

    // Draw the mouse coordinates.
    mouseX = battlefield_web_render.mouseLocation["mouseX"];
    mouseY = battlefield_web_render.mouseLocation["mouseY"];
    colorText("("+ mouseX + ", "+ mouseY +")", canvas.width - 100, canvas.height * 0.95, "hsl(0,100%,100%)");
  },

  drawBattlefieldBackground: function() {
    // Draws the background.
    var backgroundColor = "hsl(288, 10%, 15%)";
    colorRect(
      0,
      0,
      battlefield_web_render.screen_dimensions.width,
      battlefield_web_render.screen_dimensions.height,
      backgroundColor
    );
  },

  drawBattlefieldShadow: function(camera_position, battlefield_size) {
    // Draws a shadow that the battlefield will be contained within.
    // camera_position: The upperleft corner of the camera with xcoord and ycoord properties.
    // battlefield_size: An object that has the width and height of the battlefield (in tiles)

    // Record the size of the tiles.
    tile_size = battlefield_web_render.tile_size;
    half_tile_size = 0.5 * battlefield_web_render.tile_size;

    // The upperleft corner of the shadow should be half a tile back.
    shadowLeft = 0 - camera_position.xcoord - half_tile_size;
    shadowTop = 0 - camera_position.ycoord - half_tile_size;

    // The width should be one tile width away from the right most tile.
    // This is a hex grid, so even rows are pushed half a tile outward.
    shadowWidth = battlefield_size['width'] * tile_size + tile_size + half_tile_size;

    // The height of the shadow should be one tile height more than the battlefield's height.
    shadowHeight = battlefield_size['height'] * tile_size + tile_size;

    // Get the color for the shadow- A transparent black.
    var shadowColor = "hsla(288, 0%, 50%, 0.5)";

    // Draw a shadow for the battlefield.
    colorRect(shadowLeft, shadowTop, shadowWidth, shadowHeight, shadowColor);
  },

  drawBattlefieldTiles: function(tile_drawing_information, camera_position, battlefield_size) {
    // Draws all of the given tiles on the field.
    // tile_drawing_information: A list of objects. Objects should have these keys
    //   xindex: horizontal position of tile
    //   yindex: vertical position of tile
    //   tile_image_name: nickname for the image.
    // camera_position: The upperleft corner of the camera with xcoord and ycoord properties.

    //Now draw the tiles.
    image_mapping = battlefield_web_render.tile_to_image_mapping;
    tile_size = battlefield_web_render.tile_size;

    // For each tile drawing blob
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

      //Get the image to draw on this tile.
      tile_to_draw = image_mapping[info["tile_image_name"]];

      //Now draw the image.
      canvasContext.drawImage(tile_to_draw, xcoord, ycoord);
    });
  },

  update_mouse_location: function(mouseX, mouseY, camera_position, battlefield_width, battlefield_tile_count) {
    battlefield_web_render.mouseLocation = {
      "mouseX": mouseX,
      "mouseY": mouseY
    };

    battlefield_web_render.tileHover = {
      "currently_hovering": false,
      "column": -1,
      "row": -1,
      "index": -1
    };

    // Which tile is the mouse hovering over?
    // First figure out if it's on the battlefield.
    mouseFieldX = camera_position.xcoord - mouseX;
    mouseFieldY = camera_position.ycoord - mouseY;

    tile_size = battlefield_web_render.tile_size;
    battlefield_pixel_width = battlefield_width * tile_size;
    battlefield_pixel_height = Math.ceil(battlefield_tile_count / battlefield_width);

    // If it isn't on the field, then it's not hovering.
    not_on_horizontal = (mouseFieldX < 0 || mouseFieldX > battlefield_pixel_width);
    not_on_vertical = (mouseFieldY < 0 || mouseFieldY > battlefield_pixel_height);

    if (not_on_vertical || not_on_horizontal) {
      battlefield_web_render.tileHover = {
        "currently_hovering": false,
        "column": -1,
        "row": -1,
        "index": -1
      };
    }
    else {
      // Determine which row the cursor is on.
      tile_row = Math.floor(mouseFieldY / tile_size);

      // This is a hex grid, so every other row has an offset.
      // Now determine the column.
      tile_column = Math.floor(mouseFieldX / tile_size);
      if (tile_row % 2 == 1) {
        tile_column = Math.floor((mouseFieldX + half_tile_size) / tile_size);
      }

      // Get the index.
      tile_index = (tile_row * battlefield_width) + tile_column;

      // If the given tile doesn't exist, the tile isn't hovering.
      if (tile_index >= battlefield_tile_count) {
        battlefield_web_render.tileHover = {
          "currently_hovering": false,
          "column": -1,
          "row": -1,
          "index": -1
        };
      }
      else {
        // Update the variable.
        battlefield_web_render.tileHover = {
          "currently_hovering": true,
          "column": tile_column,
          "row": tile_row,
          "index": tile_index
        };
      }
    }
  },
}
