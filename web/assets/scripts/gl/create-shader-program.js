export default (gl, fragmentShader, vertexShader) => {
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, fragmentShader);
	gl.attachShader(shaderProgram, vertexShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		throw new Error('Unable to initialize shader.');
	}

	gl.useProgram(shaderProgram);
	return shaderProgram;
};
