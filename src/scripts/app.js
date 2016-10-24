/* global document */
const createContrastMap = require('./contrast-map');
const fetchShaders = require('./fetch-shaders');
const imageOnLoad = require('./image-on-load');

const contrastMapContainer = document.querySelector('.js-contrast-map');

if (contrastMapContainer) {
  const contrastMapImage = contrastMapContainer.querySelector('.contrast-map__image');

  imageOnLoad(contrastMapImage)
  .then(fetchShaders)
  .then((shaderContents) => {
    const [fragmentShaderContent, vertexShaderContent] = shaderContents;
    const contrastMap = createContrastMap(
      contrastMapImage,
      fragmentShaderContent,
      vertexShaderContent
    );

    contrastMap.classList.add('contrast-map__overlay');
    contrastMapContainer.appendChild(contrastMap);
  });
}
