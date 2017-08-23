/* global createContrastMap, fetchImage */

const getResponseText = res => res.text();

(async () => {
	const [
		imageBase,
		imageText,
		shaderFragment,
		shaderVertex,
		minContrastRatio,
	] = await Promise.all([
		fetchImage('/image-base'),
		fetchImage('/image-text'),
		fetch('/assets/shaders/contrast-map.frag.glsl').then(getResponseText),
		fetch('/assets/shaders/contrast-map.vert.glsl').then(getResponseText),
		fetch('/contrast-ratio').then(getResponseText),
	]);

	const contrastMap = createContrastMap(
		imageBase,
		imageText,
		shaderFragment.replace('{{minContrastRatio}}', minContrastRatio),
		shaderVertex,
	);

	document.body.appendChild(contrastMap.canvas);

	console.log('Contrast map rendered');
})();
