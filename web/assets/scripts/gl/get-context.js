export default (canvas) => {
	const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	if (!gl) {
		throw new Error('WebGL is not supported');
	}

	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;

	return gl;
};
