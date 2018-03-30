attribute vec2 aVertexPosition;
attribute vec2 aTexturePosition;

varying highp vec2 vTexturePosition;

void main() {
  vTexturePosition = vec2(aVertexPosition.x + 1.0, 1.0 - aVertexPosition.y) / 2.0;
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
