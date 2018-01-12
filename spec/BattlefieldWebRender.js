describe("BattlefieldWebRender", function() {
  var tile_size = 0;

  beforeEach(function() {
    tile_size = battlefield_web_render.tile_size;
    battlefield_web_render.tileHover = {
      "currently_hovering": false,
      "column": -1,
      "row": -1,
      "index": -1
      };
  });

  it("indicates tile 0 when mouse points at 1st tile", function() {
     battlefield_web_render.update_mouse_location(
      0,
      0,
      {
        xcoord: 0,
        ycoord: 0,
      },
      1,
      1
    );

    tileHover = battlefield_web_render.tileHover;
    expect(tileHover["currently_hovering"]).toBe(true);
    expect(tileHover["row"]).toBe(0);
    expect(tileHover["column"]).toBe(0);
    expect(tileHover["index"]).toBe(0);
  });

  it("indicates tile 1 when mouse points at 2nd tile", function() {
    battlefield_web_render.update_mouse_location(
     tile_size * 1.5,
     0,
     {
       xcoord: 0,
       ycoord: 0,
     },
     2,
     3
   );

   tileHover = battlefield_web_render.tileHover;
   expect(tileHover["currently_hovering"]).toBe(true);
   expect(tileHover["row"]).toBe(0);
   expect(tileHover["column"]).toBe(1);
   expect(tileHover["index"]).toBe(1);
  });

  it("indicates row 1 when mouse points at 2nd row", function() {
    battlefield_web_render.update_mouse_location(
     tile_size / 2,
     tile_size,
     {
       xcoord: 0,
       ycoord: 0,
     },
     2,
     3
   );

   tileHover = battlefield_web_render.tileHover;
   expect(tileHover["currently_hovering"]).toBe(true);
   expect(tileHover["row"]).toBe(1);
   expect(tileHover["column"]).toBe(0);
   expect(tileHover["index"]).toBe(2);
  });

  it("indicates no tiles when mouse points at no tile on the bottom row", function() {
    battlefield_web_render.update_mouse_location(
     tile_size * 1.5,
     tile_size,
     {
       xcoord: 0,
       ycoord: 0,
     },
     2,
     3
   );

   tileHover = battlefield_web_render.tileHover;
   expect(tileHover["currently_hovering"]).toBe(false);
   expect(tileHover["row"]).toBe(-1);
   expect(tileHover["column"]).toBe(-1);
   expect(tileHover["index"]).toBe(-1);
  });

  it("indicates no tiles when mouse points off of the battlefield", function() {
    battlefield_web_render.update_mouse_location(
     0,
     0,
     {
       xcoord: -1 * tile_size,
       ycoord: -1 * tile_size,
     },
     1,
     1
   );

   tileHover = battlefield_web_render.tileHover;
   expect(tileHover["currently_hovering"]).toBe(false);
   expect(tileHover["row"]).toBe(-1);
   expect(tileHover["column"]).toBe(-1);
   expect(tileHover["index"]).toBe(-1);
  });

  it("indicates no tiles when mouse points in offset space on second row", function() {
    battlefield_web_render.update_mouse_location(
     tile_size * 2,
     tile_size,
     {
       xcoord: -1 * tile_size,
       ycoord: -1 * tile_size,
     },
     1,
     1
   );

   tileHover = battlefield_web_render.tileHover;
   expect(tileHover["currently_hovering"]).toBe(false);
   expect(tileHover["row"]).toBe(-1);
   expect(tileHover["column"]).toBe(-1);
   expect(tileHover["index"]).toBe(-1);
  });

  it("indicates no tiles when camera scrolls mouse off of the battlefield", function() {
    battlefield_web_render.update_mouse_location(
     0,
     0,
     {
       xcoord: 1 * tile_size,
       ycoord: 1 * tile_size,
     },
     2,
     3
   );

   tileHover = battlefield_web_render.tileHover;
   expect(tileHover["currently_hovering"]).toBe(false);
   expect(tileHover["row"]).toBe(-1);
   expect(tileHover["column"]).toBe(-1);
   expect(tileHover["index"]).toBe(-1);
  });

  it("indicates a different tile when camera scrolls mouse to different part of battlefield", function() {
    battlefield_web_render.update_mouse_location(
     0,
     0,
     {
       xcoord: 1 * tile_size,
       ycoord: 1.5 * tile_size,
     },
     2,
     3
   );

   tileHover = battlefield_web_render.tileHover;
   expect(tileHover["currently_hovering"]).toBe(false);
   expect(tileHover["row"]).toBe(-1);
   expect(tileHover["column"]).toBe(-1);
   expect(tileHover["index"]).toBe(-1);
  });
});
