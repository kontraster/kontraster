attribute vec2 aVertexPosition;
attribute vec2 aTexturePosition;

varying highp vec2 vTexturePosition;

void main() {
  vTexturePosition = (aVertexPosition + vec2(1.0, 1.0)) / 2.0;
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}