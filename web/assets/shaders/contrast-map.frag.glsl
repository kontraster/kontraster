// TODO: Configure this via CLI
#define OVERLAY
#define OVERLAY_COLOR vec4(1.0, 0.0, 0.0, 1.0)

precision mediump float;

uniform sampler2D uTextureBase;
uniform sampler2D uTextureText;
uniform vec2 uTextureSize;

varying highp vec2 vTexturePosition;

const float minContrastRatio = {{minContrastRatio}};

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

  return !(
    isColorEqual.r &&
    isColorEqual.g &&
    isColorEqual.b
  );
}

void main() {
	vec4 colorBase = texture2D(uTextureBase, vTexturePosition);
  vec4 colorText = texture2D(uTextureText, vTexturePosition);

	if (
		shouldRenderContrastRatio(colorBase, colorText) &&
		getContrastRatio(colorBase, colorText) < minContrastRatio
	) {
		gl_FragColor = OVERLAY_COLOR;
		return;
	}

	#ifdef OVERLAY
		gl_FragColor = texture2D(uTextureText, vTexturePosition);
	#else
		discard;
	#endif
}
