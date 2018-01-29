function drawBitmapCenteredWithRotation (useBitmap, atX, atY, withAngle) {
  canvas_context.save();
  canvas_context.translate(atX, atY);
  canvas_context.rotate(withAngle);
  canvas_context.drawImage(useBitmap, -useBitmap.width/2, -useBitmap.height/2);
  canvas_context.restore();
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvas_context.fillStyle = fillColor;
  canvas_context.fillRect(topLeftX,topLeftY,boxWidth, boxHeight);
}

function colorStrokeRect(topLeftX, topLeftY, boxWidth, boxHeight, strokeColor) {
  canvas_context.strokeStyle = strokeColor;
  canvas_context.strokeRect(topLeftX,topLeftY,boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvas_context.fillStyle = fillColor;
  canvas_context.beginPath();
  canvas_context.arc(centerX,centerY,radius,0,Math.PI*2, true);
  canvas_context.fill();
}

function colorText(showWords, textX, textY, fillColor) {
  canvas_context.fillStyle = fillColor;
  canvas_context.fillText(showWords, textX, textY);
}
