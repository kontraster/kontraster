import getWebGLContext from './gl/get-context.js';
import createShader from './gl/create-shader.js';
import createShaderProgram from './gl/create-shader-program.js';
import createTexture from './gl/create-texture.js';
import createVertexPositionBuffer from './gl/create-vertex-position-buffer.js';

export default (
	imageBase,
	imageText,
	shaderFragmentContent,
	shaderVertexContent,
) => {
	const height = imageBase.naturalHeight;
	const width = imageBase.naturalWidth;

	const canvas = document.createElement('canvas');
	canvas.height = height;
	canvas.width = width;

	const gl = getWebGLContext(canvas);
	createVertexPositionBuffer(gl);
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	const shaderFragment = createShader(gl, shaderFragmentContent, gl.FRAGMENT_SHADER);
	const shaderVertex = createShader(gl, shaderVertexContent, gl.VERTEX_SHADER);
	const shaderProgram = createShaderProgram(gl, shaderFragment, shaderVertex);

	const aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
	gl.enableVertexAttribArray(aVertexPosition);
	gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);

	const aTexturePosition = gl.getAttribLocation(shaderProgram, 'aTexturePosition');

	if (aTexturePosition !== -1) {
		gl.enableVertexAttribArray(aTexturePosition);
		gl.vertexAttribPointer(aTexturePosition, 2, gl.FLOAT, false, 0, 0);
	}

	const imageBaseTexture = createTexture(gl, imageBase);
	const imageTextTexture = createTexture(gl, imageText);

	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTextureBase'), 0);
	gl.bindTexture(gl.TEXTURE_2D, imageBaseTexture);

	gl.activeTexture(gl.TEXTURE1);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTextureText'), 1);
	gl.bindTexture(gl.TEXTURE_2D, imageTextTexture);

	const uTextureSize = gl.getUniformLocation(shaderProgram, 'uTextureSize');
	gl.uniform2fv(uTextureSize, [width, height]);

	gl.drawArrays(gl.TRIANGLES, 0, 6);

	const pixels = new Uint8Array(width * height * 4);
	gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

	return {
		canvas,
		pixels,
	};
};
