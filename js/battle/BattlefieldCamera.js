/* Battlefield Camera tracks the location of the viewport and offers updates.
*/

var battlefield_camera = {
  _camera_position_x: 0,
  _camera_position_y: 0,

  getCameraLocation: function() {
    return {
      x: battlefield_camera._camera_position_x,
      y: battlefield_camera._camera_position_y,
    }
  },

  snapToLocation: function (new_camera_x, new_camera_y) {
    /* Immediately snaps the camera to the new position.
    */

    battlefield_camera._camera_position_x = new_camera_x;
    battlefield_camera._camera_position_y = new_camera_y;
  },

  scrollCameraBasedOnMouse(current_mouse_location, screen_dimensions,
    battlefield_dimensions, tile_size) {
    /* Moves the camera if the mouse is at the edge of the screen.

    current_mouse_location is an object with x and y attributes
      representing where the mouse is on screen.
    screen_dimensions: Object with width and height attributes representing
      the overall dimensions of the screen.
    battlefield_dimensions: Object with width and height attributes representing
      the overall dimensions of the screen.
    tile_size: The size of a single tile.
    */

    new_camera_position = {
      x: battlefield_camera._camera_position_x,
      y: battlefield_camera._camera_position_y
    };

    // Get the width and height of the map.
    battlefield_pixel_width = battlefield_dimensions.width;
    battlefield_pixel_height = battlefield_dimensions.height;

    // Scroll camera left if needed
    original_x = new_camera_position.x;
    if (battlefield_camera._canCameraScrollInDirection(
      "left",
      new_camera_position.x,
      screen_dimensions.width,
      battlefield_pixel_width,
      battlefield_pixel_height,
      tile_size
    )) {
      new_camera_position.x = battlefield_camera._determineCameraScroll(
        original_x,
        screen_dimensions.width,
        current_mouse_location.x,
        true,
        0.2
      );
    }
    // If you didn't scroll left, maybe scroll right
    if (new_camera_position.x == original_x) {
      if (battlefield_camera._canCameraScrollInDirection(
        "right",
        new_camera_position.x,
        screen_dimensions.width,
        battlefield_pixel_width,
        battlefield_pixel_height,
        tile_size
      )) {
        new_camera_position.x = battlefield_camera._determineCameraScroll(
          original_x,
          screen_dimensions.width,
          current_mouse_location.x,
          false,
          0.2
        );
      }
    }
    // Scroll camera up if needed
    original_y = new_camera_position.y;
    if (battlefield_camera._canCameraScrollInDirection(
      "up",
      new_camera_position.y,
      screen_dimensions.height,
      battlefield_pixel_width,
      battlefield_pixel_height,
      tile_size
    )) {
      new_camera_position.y = battlefield_camera._determineCameraScroll(
        original_y,
        screen_dimensions.height,
        current_mouse_location.y,
        true,
        0.2
      );
    }
    // If you didn't scroll up, maybe scroll down
    if (battlefield_camera._canCameraScrollInDirection(
      "down",
      new_camera_position.y,
      screen_dimensions.height,
      battlefield_pixel_width,
      battlefield_pixel_height,
      tile_size
    )) {
      if (new_camera_position.y == original_y) {
        new_camera_position.y = battlefield_camera._determineCameraScroll(
          original_y,
          screen_dimensions.height,
          current_mouse_location.y,
          false,
          0.2
        );
      }
    }

    // Update camera position
    battlefield_camera._camera_position_x = new_camera_position.x;
    battlefield_camera._camera_position_y = new_camera_position.y;
  },

  _canCameraScrollInDirection: function(scroll_direction, camera,
    screen_dimension, battlefield_pixel_width, battlefield_pixel_height,
    tile_size) {
    /*  Returns true if the camera can scroll in that direction.
        scroll_direction: string "up" "right" "down" "left"
        camera: camera's location on the scroll_direction's axis.
        screen_dimension: size of the relevant screen dimension
        battlefield_pixel_width: Width that the entire battlefield spans.
        battlefield_pixel_width: Height that the entire battlefield spans.
        tile_size: Size of a single tile, in pixels.
    */

    // The battlefield should have at most a 1 tile size gap.
    // Depending on the direction, note the maximum camera direction.
    var camera_position_threshold = 0;
    var camera_should_be_less_than_threshold = false;

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
        throw "battlefield_camera._canCameraScrollInDirection: unknown direction " + scroll_direction;
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

  _determineCameraScroll: function(camera_location, screen_size,
    current_mouse_location, scroll_if_mouse_less_than_screen,
    scroll_threshold) {
    /* Helper function returns the new location the camera should be at.
    camera_location: 1D position of the side of the screen
    screen_size: size of the relevant screen dimension
    current_mouse_location: mouse's 1D location
    scroll_if_mouse_less_than_screen: if true, the mouse value should be less
      than the screen's value to trigger the scroll.
    scroll_threshold: This number indicates the fraction of the screen_size that
      will trigger the screen scroll
    */
    new_camera = camera_location;
    amount_past_screen_margin = 0;


    if (scroll_if_mouse_less_than_screen) {
      screen_margin = screen_size * scroll_threshold;
      amount_past_screen_margin = screen_margin - current_mouse_location;
      new_camera = camera_location - 5;
    }
    else {
      screen_margin = screen_size - (screen_size * scroll_threshold);
      amount_past_screen_margin = current_mouse_location - screen_margin;
      new_camera = camera_location + 5;
    }

    if (amount_past_screen_margin > 0) {
      return new_camera;
    }
    return camera_location;
  },
}
