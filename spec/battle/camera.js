describe("battlefield_camera", function() {
  var default_input = {
      mouseX: 0,
      mouseY: 0
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

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
          mouseX: 0,
          mouseY: canvas.height / 2.0
      }
    );

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBeLessThan(tile_size);
    expect(new_camera_position.y).toBe(tile_size);
  });

  it("Moves the camera vertically", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(tile_size, tile_size);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
            mouseX: canvas.width / 2.0,
            mouseY: 0
      }
    );

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(tile_size);
    expect(new_camera_position.y).toBeLessThan(tile_size);
  });

  it("Moves the camera diagonally", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(canvas.width, canvas.height);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: -3 * tile_size,
        mouseY: -3 * tile_size
      }
    );

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBeGreaterThan(-3 * tile_size);
    expect(new_camera_position.y).toBeGreaterThan(-3 * tile_size);
  });

  it("Does not move the camera left because the battlefield is off screen", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(-3 * tile_size, 1.5 * tile_size);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: 0,
        mouseY: canvas.height / 2
      }
    );

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(-3 * tile_size);
    expect(new_camera_position.y).toBe(1.5 * tile_size);
  });

  it("does not move the camera right because the battlefield is off screen", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(3 * tile_size, 1.5 * tile_size);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: canvas.width,
        mouseY: canvas.height / 2
      }
    );

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(3 * tile_size);
    expect(new_camera_position.y).toBe(1.5 * tile_size);
  });

  it("does not move the camera up because the battlefield is off screen", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(1.5 * tile_size, -3 * tile_size);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: canvas.width / 2,
        mouseY: 0
      }
    );

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(1.5 * tile_size);
    expect(new_camera_position.y).toBe(-3 * tile_size);
  });

  it("does not move the camera down because the battlefield is off screen", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(1.5 * tile_size, 3 * tile_size);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: canvas.width / 2,
        mouseY: canvas.height
      }
    );

    // Now get the camera position
    new_camera_position = battlefield_context.getCameraPosition();

    expect(new_camera_position.x).toBe(1.5 * tile_size);
    expect(new_camera_position.y).toBe(3 * tile_size);
  });
});
