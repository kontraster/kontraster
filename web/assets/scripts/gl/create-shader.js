export default (gl, shaderContent, shaderType) => {
	const shader = gl.createShader(shaderType);

	gl.shaderSource(shader, shaderContent);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader));
	}

	return shader;
};
