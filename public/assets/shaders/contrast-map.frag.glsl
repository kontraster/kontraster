uniform sampler2D uTexture;
varying highp vec2 vTexturePosition;

void main() {
  gl_FragColor = texture2D(uTexture, vec2(vTexturePosition.s, 1.0 - vTexturePosition.t));
}