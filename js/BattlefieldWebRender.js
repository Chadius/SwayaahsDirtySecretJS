/*
battlefield renders the battlefield to the screen.
*/

var battlefield_web_render = {
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
      battlefield_web_render
    );
    battlefield_web_render.tile_to_image_mapping['wall'] = new_images["wall"];
    battlefield_web_render.tile_to_image_mapping['grass'] = new_images["grass"];
    battlefield_web_render.tile_to_image_mapping['road'] = new_images["road"];
    battlefield_web_render.tile_to_image_mapping['sky'] = new_images["sky"];
  },

  drawBattlefield: function(tile_drawing_information) {
    //Draws all of the given tiles on the field.
    // tile_drawing_information: A list of objects. Objects should have these keys
    //   xindex: horizontal position of tile
    //   yindex: vertical position of tile
    //   tile_image_name: nickname for the image.
    image_mapping = battlefield_web_render.tile_to_image_mapping;
    tile_size = battlefield_web_render.tile_size;

    // For each tile drawing blob
    tile_drawing_information.forEach(function(info) {
      // Convert x & y indecies to pixel based coordinates.
      xindex = info['xindex'];
      yindex = info['yindex'];

      xcoord = xindex * tile_size;
      ycoord = yindex * tile_size;

      // This is a hex grid, so add an offset to every other line.
      if (yindex % 2 == 1) {
        xcoord += tile_size / 2;
      }

      //Get the image to draw on this tile.
      tile_to_draw = image_mapping[info["tile_image_name"]];

      //Now draw the image.
      canvasContext.drawImage(tile_to_draw, xcoord, ycoord);
    });
  }
}
