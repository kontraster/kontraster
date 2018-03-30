import createContrastMap from './contrast-map.js';
import fetchImage from './fetch-image.js';

(async () => {
	const [
		imageBase,
		imageText,
		shaderFragment,
		shaderVertex,
		info,
	] = await Promise.all([
		fetchImage('/image-base'),
		fetchImage('/image-text'),
		fetch('/assets/shaders/contrast-map.frag.glsl').then(res => res.text()),
		fetch('/assets/shaders/contrast-map.vert.glsl').then(res => res.text()),
		fetch('/info').then(res => res.json()),
	]);

	const shaderConstants = `
#define ${info.outputType}
#define OVERLAY_COLOR vec4(1.0, 0.0, 0.0, 1.0)
#define CONTRAST_RATIO ${info.contrastRatio}`;

	const contrastMap = createContrastMap(
		imageBase,
		imageText,
		`${shaderConstants}\n${shaderFragment}`,
		shaderVertex,
	);

	document.body.appendChild(contrastMap.canvas);

	console.log('Contrast map rendered');
})();
