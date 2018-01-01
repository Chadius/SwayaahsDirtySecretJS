var inputHandler = {
  mouseX: -1,
  mouseY: -1,

  setupInput: function(canvas) {
    // Add listeners for the mouse.
    canvas.addEventListener('mousemove', inputHandler.updateMousePos);
  },

  updateMousePos: function(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    inputHandler.mouseX = evt.clientX - rect.left - root.scrollLeft;
    inputHandler.mouseY = evt.clientY - rect.top - root.scrollTop;
  }
}
