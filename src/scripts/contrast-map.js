/* global document */

/**
 * Get a canvas’ WebGL context.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to get the context for.
 * @return {WebGLRenderingContext}
 */
function getWebGLContext(canvas) {
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;

  return gl;
}

/**
 * Create a shader from a shader source and type.
 *
 * @param {WebGLRenderingContext} gl - The rendering context to create the shader for.
 * @param {String} shaderContent - The contents of the shader.
 * @param {Number} shaderType - The shader type to create.
 * @return {WebGLShader}
 */
function createShader(gl, shaderContent, shaderType) {
  const shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderContent);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

/**
 * Create a shader program.
 *
 * @param {WebGLRenderingContext} gl - The rendering context to create the shader program for.
 * @param {WebGLShader} fragmentShader - The fragment shader.
 * @param {WebGLShader} vertexShader - The vertex shader.
 * @return {WebGLShader}
 */
function createShaderProgram(gl, fragmentShader, vertexShader) {
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, fragmentShader);
  gl.attachShader(shaderProgram, vertexShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error('Unable to initialize shader.');
  }

  gl.useProgram(shaderProgram);
  return shaderProgram;
}

/**
 * Create a vertex buffer for the plane.
 *
 * @param {WebGLRenderingContext} gl - The rendering context to create the vertex buffer for.
 * @return {WebGLBuffer}
 */
function createVertexPositionBuffer(gl) {
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
}

/**
 * Create a texture from an image.
 *
 * @param {WebGLRenderingContext} gl - The rendering context to create the image for.
 * @param {Image} image - The image to convert into a texture.
 * @return {WebGLTexture}
 */
function createTexture(gl, image) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  return texture;
}

/**
 * Create a contrast map.
 *
 * @param {Image} imageBase - The base image.
 * @param {Image} imageHeadings - The exclusively containing headings.
 * @param {Image} imageText - The exclusively containing plain text.
 * @param {String} fragmentShaderContent - The fragment shader source.
 * @param {String} vertexShaderContent - The vertex shader source;
 * @return {Object}
 */
function createContrastMap(
  imageBase,
  imageHeadings,
  imageText,
  fragmentShaderContent,
  vertexShaderContent
) {
  const height = imageBase.naturalHeight;
  const width = imageBase.naturalWidth;

  const canvas = document.createElement('canvas');
  canvas.height = height;
  canvas.width = width;

  const gl = getWebGLContext(canvas);
  createVertexPositionBuffer(gl);
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  const fragmentShader = createShader(gl, fragmentShaderContent, gl.FRAGMENT_SHADER);
  const vertexShader = createShader(gl, vertexShaderContent, gl.VERTEX_SHADER);
  const shaderProgram = createShaderProgram(gl, fragmentShader, vertexShader);

  const aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(aVertexPosition);
  gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);

  const aTexturePosition = gl.getAttribLocation(shaderProgram, 'aTexturePosition');

  if (aTexturePosition !== -1) {
    gl.enableVertexAttribArray(aTexturePosition);
    gl.vertexAttribPointer(aTexturePosition, 2, gl.FLOAT, false, 0, 0);
  }

  const imageBaseTexture = createTexture(gl, imageBase);
  const imageHeadingsTexture = createTexture(gl, imageHeadings);
  const imageTextTexture = createTexture(gl, imageText);

  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTextureBase'), 0);
  gl.bindTexture(gl.TEXTURE_2D, imageBaseTexture);

  gl.activeTexture(gl.TEXTURE1);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTextureHeadings'), 1);
  gl.bindTexture(gl.TEXTURE_2D, imageHeadingsTexture);

  gl.activeTexture(gl.TEXTURE2);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uTextureText'), 2);
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
}

module.exports = createContrastMap;
