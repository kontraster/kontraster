/* global fetch */
import 'whatwg-fetch';

function fetchShaders() {
  const readShaderResponse = shaderResponse => shaderResponse.text();

  return Promise.all([
    fetch('/assets/shaders/contrast-map.frag.glsl'),
    fetch('/assets/shaders/contrast-map.vert.glsl'),
  ])
  .then(shaderResponses => Promise.all(shaderResponses.map(readShaderResponse)));
}

module.exports = fetchShaders;
