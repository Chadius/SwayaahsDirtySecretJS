/* Battlefield Input takes in player input and can update the context.
*/

var battlefield_input = {

  last_mouse_location: {
    x: -1,
    y: -1
  },

  tile_currently_hovering: {
  },

  reset: function () {
    /* Immediately clear all tracked input state. */
    battlefield_input.tile_currently_hovering = {};
  },

  getTileMouseHoversOver: function() {
    return battlefield_input.tile_currently_hovering;
  },

  getMouseLocation: function() {
    return battlefield_input.last_mouse_location;
  },

  setMouse: function(mouse_info) {
    /* Accesses the mouse_info to learn about where the mouse is.*/

    // Update the last_mouse_location
    battlefield_input.last_mouse_location.x = mouse_info.x;
    battlefield_input.last_mouse_location.y = mouse_info.y;
  },

  updateTilesSelection: function(
    camera_position,
    battlefield_pixel_size,
    battlefield_tile_size,
    battlefield_width,
    battlefield_tile_count
  ) {
    /* Use the last mouse location to figure out which tile the user
    is hovering over.
    */

    // First figure out if it's on the battlefield.
    mouse_field_x = battlefield_input.last_mouse_location.x + camera_position.x;
    mouse_field_y = battlefield_input.last_mouse_location.y + camera_position.y;

    // Get the battlefield dimensions.
    battlefield_pixel_width = battlefield_pixel_size.width;
    battlefield_pixel_height = battlefield_pixel_size.height;

    // If it isn't on the field, then it's not hovering.
    not_on_horizontal = (mouse_field_x < 0 || mouse_field_x > battlefield_pixel_width);
    not_on_vertical = (mouse_field_y < 0 || mouse_field_y > battlefield_pixel_height);

    if (not_on_vertical || not_on_horizontal) {
      battlefield_input.tile_currently_hovering = null;
      return;
    }

    var half_tile_size = 0.5 * battlefield_tile_size;

    // Determine which row the cursor is on.
    tile_row = Math.floor(mouse_field_y / battlefield_tile_size);

    // Now determine the column.
    tile_column = Math.floor(mouse_field_x / battlefield_tile_size);

    // This is a hex grid, so every other row has an offset.
    if (tile_row % 2 == 1) {
      tile_column = Math.floor((mouse_field_x - half_tile_size) / battlefield_tile_size);
    }

    // Get the index.
    tile_index = (tile_row * battlefield_width) + tile_column;

    // If the given tile doesn't exist, the tile isn't hovering.
    if (tile_index >= battlefield_tile_count
      || tile_column < 0
      || tile_row < 0
    ) {
      battlefield_input.tile_currently_hovering = null;
      return;
    }

    battlefield_input.tile_currently_hovering = {
      row: tile_row,
      column: tile_column,
      index: tile_index
    };
  }
}
