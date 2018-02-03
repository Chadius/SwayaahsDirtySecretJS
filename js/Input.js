var inputHandler = {
  mouseX: -1,
  mouseY: -1,
  button_clicked: null,

  resetInputFlags: function() {
    inputHandler.button_clicked = null;
  },

  setupInput: function(canvas) {
    // Add listeners for the mouse.
    canvas.addEventListener('mousemove', inputHandler.updateMousePos);
    canvas.addEventListener('click', inputHandler.updateMouseClick);
  },

  updateMousePos: function(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    inputHandler.mouseX = evt.clientX - rect.left - root.scrollLeft;
    inputHandler.mouseY = evt.clientY - rect.top - root.scrollTop;
  },

  updateMouseClick: function(evt) {
    var button_clicked = evt.button;
    inputHandler.button_clicked = button_clicked;
  }
}
