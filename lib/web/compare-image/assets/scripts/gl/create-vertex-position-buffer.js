export default (gl) => {
	const vertexPositionBuffer = gl.createBuffer();
	const vertices = new Float32Array([
		-1.0, -1.0,
		1.0, -1.0,
		-1.0, 1.0,
		-1.0, 1.0,
		1.0, -1.0,
		1.0, 1.0,
	]);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	return vertexPositionBuffer;
};
