describe("battlefield_tile_select", function() {
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

  it("indicates tile 0 when mouse points at 1st tile", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(0,0);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      default_input
    );

    // Set the tiles
    battlefield_context.setTiles(1, [1]);

    // Ask which tile the mouse is hovering over
    tile_hover = battlefield_context.getTileMouseHoversOver();
    expect(tile_hover).toBeTruthy();
    expect(tile_hover.row).toBe(0);
    expect(tile_hover.column).toBe(0);
    expect(tile_hover.index).toBe(0);
  });

  it("indicates tile 1 when mouse points at 2nd tile", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(0,0);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: tile_size * 1.5,
        mouseY: 0,
      }
    );

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1]);

    // Ask which tile the mouse is hovering over
    tile_hover = battlefield_context.getTileMouseHoversOver();
    expect(tile_hover).toBeTruthy();
    expect(tile_hover.row).toBe(0);
    expect(tile_hover.column).toBe(1);
    expect(tile_hover.index).toBe(1);
  });

  it("indicates row 1 when mouse points at 2nd row", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(0,0);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: tile_size /2,
        mouseY: tile_size,
      }
    );

    // Ask which tile the mouse is hovering over
    tile_hover = battlefield_context.getTileMouseHoversOver();
    expect(tile_hover).toBeTruthy();
    expect(tile_hover.row).toBe(1);
    expect(tile_hover.column).toBe(0);
    expect(tile_hover.index).toBe(2);
  });

  it("indicates no tiles when mouse points at no tile on the bottom row", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(0,0);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: tile_size * 1.5,
        mouseY: tile_size,
      }
    );

    // Ask which tile the mouse is hovering over
    tile_hover = battlefield_context.getTileMouseHoversOver();
    expect(tile_hover).toBeFalsy();
  });

  it("indicates no tiles when mouse points off of the battlefield", function() {
    // Set the tiles
    battlefield_context.setTiles(1, [1]);

    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(-1 * tile_size, -1 * tile_size);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(default_input);

    // Ask which tile the mouse is hovering over
    tile_hover = battlefield_context.getTileMouseHoversOver();
    expect(tile_hover).toBeFalsy();
  });

  it("indicates no tiles when mouse points in offset space on second row", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(-1 * tile_size, -1 * tile_size);

    // Set the tiles
    battlefield_context.setTiles(1, [1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: tile_size * 2,
        mouseY: tile_size,
      }
    );

    // Ask which tile the mouse is hovering over
    tile_hover = battlefield_context.getTileMouseHoversOver();
    expect(tile_hover).toBeFalsy();
  });

  it("indicates no tiles when camera scrolls mouse off of the battlefield", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(-1 * tile_size, -1 * tile_size);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(default_input);

    // Ask which tile the mouse is hovering over
    tile_hover = battlefield_context.getTileMouseHoversOver();
    expect(tile_hover).toBeFalsy();
  });

  it("indicates a different tile when camera scrolls mouse to different part of battlefield", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(tile_size, 1.5 * tile_size);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(default_input);

    // Ask which tile the mouse is hovering over
    tile_hover = battlefield_context.getTileMouseHoversOver();
    expect(tile_hover).toBeTruthy();
    expect(tile_hover.row).toBe(1);
    expect(tile_hover.column).toBe(0);
    expect(tile_hover.index).toBe(2);
  });

  it("doesn't hover the offset tile", function() {
    // Tell the battle context where the camera is.
    battlefield_context.resetCamera(0,0);

    // Set the tiles
    battlefield_context.setTiles(2, [1,1,1]);

    // Tell the battle context where the mouse is.
    battlefield_context.handleInput(
      {
        mouseX: 0,
        mouseY: 1.5 * tile_size
      }
    );

    // Ask which tile the mouse is hovering over
    tile_hover = battlefield_context.getTileMouseHoversOver();
    expect(tile_hover).toBeFalsy();
  });
});
