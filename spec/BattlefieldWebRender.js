describe("BattlefieldWebRender", function() {
  beforeEach(function() {
    battlefield_web_render.tileHover = {
      "currently_hovering": false,
      "column": -1,
      "row": -1,
      "index": -1
      };
  });

  var a;

  it("mentions the 0,0 tile when mouse at upperleft corner", function() {
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
  });
});
