describe("battlefield_camera", function() {
  var default_input = {
    getMouseLocation: function () {
      return {
        x: 0,
        y: 0
      }
    },
    getMouseClicked: function () {
      return {
        button_clicked: null
      }
    }
  };
  var canvas = {
    width: 0,
    height: 0,
  };

  beforeEach(function() {
    tile_size = battlefield_web_render.tile_size;
    half_tile_size = tile_size / 2.0;
    canvas = {
      width: tile_size * 3,
      height: tile_size * 3,
    };
    battlefield_context.screen_dimensions = canvas;
    battlefield_context.camera = battlefield_camera;
    battlefield_context.input = battlefield_input;
    battlefield_context.setTiles(3, [1,1,1]);
    battlefield_context.resetInput();
  });

  it("Moves the camera horizontally", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(tile_size, tile_size);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        getMouseLocation: function () {
          return {
            x: 0,
            y: canvas.height / 2.0
          }
        },
        getMouseClicked: default_input.getMouseClicked
      }
    );

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBeLessThan(tile_size);
    expect(new_camera_position.y).toBe(tile_size);
  });

  it("Moves the camera vertically", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(tile_size, tile_size);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        getMouseLocation: function () {
          return {
            x: canvas.width / 2.0,
            y: 0
          }
        },
        getMouseClicked: default_input.getMouseClicked
      }
    );

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(tile_size);
    expect(new_camera_position.y).toBeLessThan(tile_size);
  });

  it("Moves the camera diagonally", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(canvas.width, canvas.height);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        getMouseLocation: function () {
          return {
            x: -3 * tile_size,
            y: -3 * tile_size
          }
        },
        getMouseClicked: default_input.getMouseClicked
      }
    );

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBeGreaterThan(-3 * tile_size);
    expect(new_camera_position.y).toBeGreaterThan(-3 * tile_size);
  });

  it("Does not move the camera left because the battlefield is off screen", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(-3 * tile_size, 1.5 * tile_size);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        getMouseLocation: function () {
          return {
            x: 0,
            y: canvas.height / 2
          }
        },
        getMouseClicked: default_input.getMouseClicked
      }
    );

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(-3 * tile_size);
    expect(new_camera_position.y).toBe(1.5 * tile_size);
  });

  it("does not move the camera right because the battlefield is off screen", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(3 * tile_size, 1.5 * tile_size);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        getMouseLocation: function () {
          return {
            x: canvas.width,
            y: canvas.height / 2
          }
        },
        getMouseClicked: default_input.getMouseClicked
      }
    );

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(3 * tile_size);
    expect(new_camera_position.y).toBe(1.5 * tile_size);
  });

  it("does not move the camera up because the battlefield is off screen", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(1.5 * tile_size, -3 * tile_size);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        getMouseLocation: function () {
          return {
            x: canvas.width / 2,
            y: 0
          }
        },
        getMouseClicked: default_input.getMouseClicked
      }
    );

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(1.5 * tile_size);
    expect(new_camera_position.y).toBe(-3 * tile_size);
  });

  it("does not move the camera down because the battlefield is off screen", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(1.5 * tile_size, 3 * tile_size);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        getMouseLocation: function () {
          return {
            x: canvas.width / 2,
            y: canvas.height
          }
        },
        getMouseClicked: default_input.getMouseClicked
      }
    );

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(1.5 * tile_size);
    expect(new_camera_position.y).toBe(3 * tile_size);
  });
});
