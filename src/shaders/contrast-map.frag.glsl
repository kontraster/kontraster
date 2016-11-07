precision mediump float;

uniform sampler2D uTextureBase;
uniform sampler2D uTextureHeadings;
uniform sampler2D uTextureText;
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

float getContrastRatio(sampler2D targetTexture) {
  vec4 color = texture2D(uTextureBase, vTexturePosition);
  vec4 targetColor = texture2D(targetTexture, vTexturePosition);
  float contrastRatio = 0.0;

  if (!shouldRenderContrastRatio(color, targetColor)) {
    return contrastRatio;
  }

  for (int offset = 1; offset <= 4; offset++) {
    float offsetFloat = float(offset);

    contrastRatio = max(contrastRatio, getContrastRatio(color, texture2D(uTextureBase, vTexturePosition + vec2(0.0, -offsetFloat / uTextureSize.y))));
    contrastRatio = max(contrastRatio, getContrastRatio(color, texture2D(uTextureBase, vTexturePosition + vec2(offsetFloat / uTextureSize.x, 0.0))));
    contrastRatio = max(contrastRatio, getContrastRatio(color, texture2D(uTextureBase, vTexturePosition + vec2(0.0, offsetFloat / uTextureSize.y))));
    contrastRatio = max(contrastRatio, getContrastRatio(color, texture2D(uTextureBase, vTexturePosition + vec2(-offsetFloat / uTextureSize.x, 0.0))));
  }

  return contrastRatio;
}

void main() {
  vec4 outputColor = vec4(.0, .0, .0, .0);

  float contrastRatioHeadings = getContrastRatio(uTextureHeadings);
  float contrastRatioText = getContrastRatio(uTextureText);

  // Level AAA
  if (contrastRatioHeadings >= 4.5 || contrastRatioText >= 7.0) {
    outputColor.r = .51372549;
    outputColor.g = .847058824;
    outputColor.b = .070588235;
    outputColor.a = 1.0;
  }
  // Level AA
  else if (contrastRatioHeadings >= 3.0 || contrastRatioText >= 4.5) {
    outputColor.r = 1.0;
    outputColor.g = .658823529;
    outputColor.b = .290196078;
    outputColor.a = 1.0;
  }
  // Level A
  else if (contrastRatioHeadings > .0 || contrastRatioText > .0) {
    outputColor.r = .968627451;
    outputColor.g = .349019608;
    outputColor.b = .294117647;
    outputColor.a = 1.0;
  }

  gl_FragColor = outputColor;
}
