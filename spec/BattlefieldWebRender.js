describe("BattlefieldWebRender", function() {
  var tile_size = 0;
  var half_tile_size = 0;
  var canvas = {
    width: 0,
    height: 0,
  };
  var camera_position = {
    xcoord: 0,
    ycoord: 0,
  };

  beforeEach(function() {
    tile_size = battlefield_web_render.tile_size;
    half_tile_size = tile_size / 2.0;
    canvas = {
      width: tile_size * 3,
      height: tile_size * 3,
    };
    battlefield_web_render.tile_hover = {
      "currently_hovering": false,
      "column": -1,
      "row": -1,
      "index": -1
      };
  });

  it("indicates tile 0 when mouse points at 1st tile", function() {
     battlefield_web_render.updateMouseLocation(
      0,
      0,
      {
        button_pressed: null,
        button_is_up: false,
        button_is_down: false,
      },
      {
        xcoord: 0,
        ycoord: 0,
      },
      1,
      1
    );

    tile_hover = battlefield_web_render.tile_hover;
    expect(tile_hover["currently_hovering"]).toBe(true);
    expect(tile_hover["row"]).toBe(0);
    expect(tile_hover["column"]).toBe(0);
    expect(tile_hover["index"]).toBe(0);
  });

  it("indicates tile 1 when mouse points at 2nd tile", function() {
    battlefield_web_render.updateMouseLocation(
     tile_size * 1.5,
     0,
     {
       button_pressed: null,
       button_is_up: false,
       button_is_down: false,
     },
     {
       xcoord: 0,
       ycoord: 0,
     },
     2,
     3
   );

   tile_hover = battlefield_web_render.tile_hover;
   expect(tile_hover["currently_hovering"]).toBe(true);
   expect(tile_hover["row"]).toBe(0);
   expect(tile_hover["column"]).toBe(1);
   expect(tile_hover["index"]).toBe(1);
  });

  it("indicates row 1 when mouse points at 2nd row", function() {
    battlefield_web_render.updateMouseLocation(
     tile_size / 2,
     tile_size,
     {
       button_pressed: null,
       button_is_up: false,
       button_is_down: false,
     },
     {
       xcoord: 0,
       ycoord: 0,
     },
     2,
     3
   );

   tile_hover = battlefield_web_render.tile_hover;
   expect(tile_hover["currently_hovering"]).toBe(true);
   expect(tile_hover["row"]).toBe(1);
   expect(tile_hover["column"]).toBe(0);
   expect(tile_hover["index"]).toBe(2);
  });

  it("indicates no tiles when mouse points at no tile on the bottom row", function() {
    battlefield_web_render.updateMouseLocation(
     tile_size * 1.5,
     tile_size,
     {
       button_pressed: null,
       button_is_up: false,
       button_is_down: false,
     },
     {
       xcoord: 0,
       ycoord: 0,
     },
     2,
     3
   );

   tile_hover = battlefield_web_render.tile_hover;
   expect(tile_hover["currently_hovering"]).toBe(false);
   expect(tile_hover["row"]).toBe(-1);
   expect(tile_hover["column"]).toBe(-1);
   expect(tile_hover["index"]).toBe(-1);
  });

  it("indicates no tiles when mouse points off of the battlefield", function() {
    battlefield_web_render.updateMouseLocation(
     0,
     0,
     {
       button_pressed: null,
       button_is_up: false,
       button_is_down: false,
     },
     {
       xcoord: -1 * tile_size,
       ycoord: -1 * tile_size,
     },
     1,
     1
   );

   tile_hover = battlefield_web_render.tile_hover;
   expect(tile_hover["currently_hovering"]).toBe(false);
   expect(tile_hover["row"]).toBe(-1);
   expect(tile_hover["column"]).toBe(-1);
   expect(tile_hover["index"]).toBe(-1);
  });

  it("indicates no tiles when mouse points in offset space on second row", function() {
    battlefield_web_render.updateMouseLocation(
     tile_size * 2,
     tile_size,
     {
       button_pressed: null,
       button_is_up: false,
       button_is_down: false,
     },
     {
       xcoord: -1 * tile_size,
       ycoord: -1 * tile_size,
     },
     1,
     1
   );

   tile_hover = battlefield_web_render.tile_hover;
   expect(tile_hover["currently_hovering"]).toBe(false);
   expect(tile_hover["row"]).toBe(-1);
   expect(tile_hover["column"]).toBe(-1);
   expect(tile_hover["index"]).toBe(-1);
  });

  it("indicates no tiles when camera scrolls mouse off of the battlefield", function() {
    battlefield_web_render.updateMouseLocation(
     0,
     0,
     {
       button_pressed: null,
       button_is_up: false,
       button_is_down: false,
     },
     {
       xcoord: -1 * tile_size,
       ycoord: -1 * tile_size,
     },
     2,
     3
   );

   tile_hover = battlefield_web_render.tile_hover;
   expect(tile_hover["currently_hovering"]).toBe(false);
   expect(tile_hover["row"]).toBe(-1);
   expect(tile_hover["column"]).toBe(-1);
   expect(tile_hover["index"]).toBe(-1);
  });

  it("indicates a different tile when camera scrolls mouse to different part of battlefield", function() {
    battlefield_web_render.updateMouseLocation(
     0,
     0,
     {
       button_pressed: null,
       button_is_up: false,
       button_is_down: false,
     },
     {
       xcoord: 1 * tile_size,
       ycoord: 1.5 * tile_size,
     },
     2,
     3
   );

   tile_hover = battlefield_web_render.tile_hover;
   expect(tile_hover["currently_hovering"]).toBe(true);
   expect(tile_hover["row"]).toBe(1);
   expect(tile_hover["column"]).toBe(0);
   expect(tile_hover["index"]).toBe(2);
  });

  it("doesn't hover the offset tile", function() {
    battlefield_web_render.updateMouseLocation(
     0,
     1.5 * tile_size,
     {
       button_pressed: null,
       button_is_up: false,
       button_is_down: false,
     },
     {
       xcoord: 0,
       ycoord: 0,
     },
     2,
     3
   );

   tile_hover = battlefield_web_render.tile_hover;
   expect(tile_hover["currently_hovering"]).toBe(false);
   expect(tile_hover["row"]).toBe(-1);
   expect(tile_hover["column"]).toBe(-1);
   expect(tile_hover["index"]).toBe(-1);
  });

  it("Moves the camera horizontally", function() {
    new_camera_position = battlefield_web_render.getNewCameraPosition(
      {
        xcoord: tile_size,
        ycoord: tile_size
      },
      {
        mouseX: 0,
        mouseY: canvas.height / 2.0
      },
      {
        width: canvas.width,
        height: canvas.height
      },
      2,
      4
    );

    expect(new_camera_position["x"]).toBeLessThan(tile_size);
    expect(new_camera_position["y"]).toBe(tile_size);
  });

  it("Moves the camera vertically", function() {
    new_camera_position = battlefield_web_render.getNewCameraPosition(
      {
        xcoord: tile_size,
        ycoord: tile_size
      },
      {
        mouseX: canvas.width / 2.0,
        mouseY: 0
      },
      {
        width: canvas.width,
        height: canvas.height
      },
      2,
      4
    );

    expect(new_camera_position["x"]).toBe(tile_size);
    expect(new_camera_position["y"]).toBeLessThan(tile_size);
  });

  it("Moves the camera diagonally", function() {
    new_camera_position = battlefield_web_render.getNewCameraPosition(
      {
        xcoord: -3 * tile_size,
        ycoord: -3 * tile_size
      },
      {
        mouseX: canvas.width,
        mouseY: canvas.height
      },
      {
        width: canvas.width,
        height: canvas.height
      },
      2,
      4
    );

    expect(new_camera_position["x"]).toBeGreaterThan(-3 * tile_size);
    expect(new_camera_position["y"]).toBeGreaterThan(-3 * tile_size);
  });

  it("Does not move the camera left because the battlefield is off screen", function() {
    new_camera_position = battlefield_web_render.getNewCameraPosition(
      {
        xcoord: -3 * tile_size,
        ycoord: 1.5 * tile_size
      },
      {
        mouseX: 0,
        mouseY: canvas.height / 2
      },
      {
        width: canvas.width,
        height: canvas.height
      },
      2,
      4
    );

    expect(new_camera_position["x"]).toBe(-3 * tile_size);
    expect(new_camera_position["y"]).toBe(1.5 * tile_size);
  });

  it("does not move the camera right because the battlefield is off screen", function() {
    new_camera_position = battlefield_web_render.getNewCameraPosition(
      {
        xcoord: 3 * tile_size,
        ycoord: 1.5 * tile_size
      },
      {
        mouseX: canvas.width,
        mouseY: canvas.height / 2
      },
      {
        width: canvas.width,
        height: canvas.height
      },
      2,
      4
    );

    expect(new_camera_position["x"]).toBe(3 * tile_size);
    expect(new_camera_position["y"]).toBe(1.5 * tile_size);
  });

  it("does not move the camera down because the battlefield is off screen", function() {
    new_camera_position = battlefield_web_render.getNewCameraPosition(
      {
        xcoord: 1.5 * tile_size,
        ycoord: -3 * tile_size
      },
      {
        mouseX: canvas.width / 2,
        mouseY: 0
      },
      {
        width: canvas.width,
        height: canvas.height
      },
      2,
      4
    );

    expect(new_camera_position["x"]).toBe(1.5 * tile_size);
    expect(new_camera_position["y"]).toBe(-3 * tile_size);
  });

  it("does not move the camera down because the battlefield is off screen", function() {
    new_camera_position = battlefield_web_render.getNewCameraPosition(
      {
        xcoord: 1.5 * tile_size,
        ycoord: 3 * tile_size
      },
      {
        mouseX: canvas.width / 2,
        mouseY: canvas.height
      },
      {
        width: canvas.width,
        height: canvas.height
      },
      2,
      4
    );

    expect(new_camera_position["x"]).toBe(1.5 * tile_size);
    expect(new_camera_position["y"]).toBe(3 * tile_size);
  });

  it("Can track mouse clicks", function() {
    battlefield_web_render.updateMouseLocation(
     0,
     0,
     {
       mouse_button_clicked: 0
     },
     {
       xcoord: 0,
       ycoord: 0,
     },
     1,
     1
   );

   tile_hover = battlefield_web_render.tile_hover;
   tile_hover = battlefield_web_render.tile_hover;
   expect(tile_hover["currently_hovering"]).toBe(true);
   expect(tile_hover["row"]).toBe(0);
   expect(tile_hover["column"]).toBe(0);
   expect(tile_hover["index"]).toBe(0);
  });
});
