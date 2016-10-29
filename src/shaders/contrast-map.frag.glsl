precision mediump float;

uniform sampler2D uTexture;
uniform sampler2D uReferenceTexture;
uniform vec2 uTextureSize;

varying highp vec2 vTexturePosition;

float getChannelLuminance(float channel) {
  if (channel <= 0.03928) {
    return channel / 12.92;
  }

  return pow((channel + 0.055) / 1.055, 2.4);
}

float getLuminance(vec4 color) {
  return 0.2126 * getChannelLuminance(color.r) +
    0.7152 * getChannelLuminance(color.g) +
    0.0722 * getChannelLuminance(color.b);
}

float getContrastRatio(vec4 aColor, vec4 bColor) {
   float aLuminance = getLuminance(aColor);
   float bLuminance = getLuminance(bColor);
   float minLuminance = min(aLuminance, bLuminance);
   float maxLuminance = max(aLuminance, bLuminance);

  return (maxLuminance + .05) / (minLuminance + .05);
}

bool shouldRenderContrastRatio(vec4 color, vec4 referenceColor) {
  bvec4 isColorEqual = equal(color, referenceColor);

  return (
    !isColorEqual.r ||
    !isColorEqual.g ||
    !isColorEqual.b
  );
}

void main() {
  vec4 color = texture2D(uTexture, vTexturePosition);
  vec4 referenceColor = texture2D(uReferenceTexture, vTexturePosition);
  vec4 outputColor = vec4(.0, .0, .0, .0);

  if (!shouldRenderContrastRatio(color, referenceColor)) {
    gl_FragColor = outputColor;
    return;
  }

  float contrastRatio = 0.0;

  for (int offset = 1; offset <= 4; offset++) {
    float offsetFloat = float(offset);

    contrastRatio = max(contrastRatio, getContrastRatio(color, texture2D(uTexture, vTexturePosition + vec2(0.0, -offsetFloat / uTextureSize.y))));
    contrastRatio = max(contrastRatio, getContrastRatio(color, texture2D(uTexture, vTexturePosition + vec2(offsetFloat / uTextureSize.x, 0.0))));
    contrastRatio = max(contrastRatio, getContrastRatio(color, texture2D(uTexture, vTexturePosition + vec2(0.0, offsetFloat / uTextureSize.y))));
    contrastRatio = max(contrastRatio, getContrastRatio(color, texture2D(uTexture, vTexturePosition + vec2(-offsetFloat / uTextureSize.x, 0.0))));
  }

  if (contrastRatio >= 7.0) {
    outputColor.g = 1.0;
    outputColor.a = 1.0;
  } else if (contrastRatio >= 4.5) {
    outputColor.r = 1.0;
    outputColor.g = .5;
    outputColor.a = 1.0;
  } else {
    outputColor.r = 1.0;
    outputColor.a = 1.0;
  }

  gl_FragColor = outputColor;
}
