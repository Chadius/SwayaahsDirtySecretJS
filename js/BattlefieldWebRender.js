/*
battlefield renders the battlefield to the screen.
*/

var battlefield_web_render = {
  tile_size: 96,

  tile_to_image_mapping: {},

  finished_loading_images: false,
  pending_required_images_count: 0,
  screen_dimensions: {'width':null, 'height':null},

  loadRequiredImages: function() {
    // These are images that MUST be loaded before displaying anything to the user.
    new_images = image_loading.loadRequiredImagesForObject(
      [
        {varName: "wall", theFile: "Wall Tile.png"},
        {varName: "grass", theFile: "Green Tile.png"},
        {varName: "road", theFile: "Road Tile.png"},
        {varName: "sky", theFile: "Sky Tile.png"},
        {varName: "single", theFile: "default_move_tile.png"},
        {varName: "double", theFile: "double_tile.png"},
        {varName: "passthrough", theFile: "pass_through_tile.png"}
      ],
      battlefield_web_render
    );
    battlefield_web_render.tile_to_image_mapping['single'] = new_images["single"];
    battlefield_web_render.tile_to_image_mapping['double'] = new_images["double"];
    battlefield_web_render.tile_to_image_mapping['passthrough'] = new_images["passthrough"];

    battlefield_web_render.tile_to_image_mapping['wall'] = new_images["wall"];
    battlefield_web_render.tile_to_image_mapping['grass'] = new_images["grass"];
    battlefield_web_render.tile_to_image_mapping['road'] = new_images["road"];
    battlefield_web_render.tile_to_image_mapping['sky'] = new_images["sky"];
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
}
