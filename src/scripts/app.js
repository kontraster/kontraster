const createContrastMap = require('./contrast-map');
const fetchShaders = require('./fetch-shaders');
const imageOnLoad = require('./image-on-load');

const contrastMapContainer = document.querySelector('.js-contrast-map');

function createImage(source) {
  const image = new Image();
  image.src = source;
  return image;
}

if (contrastMapContainer) {
  const contrastMapImage = createImage(contrastMapContainer.getAttribute('data-contrast-image-url'));
  contrastMapImage.classList.add('contrast-map__image');

  Promise.all([
    imageOnLoad(contrastMapImage),
    fetchShaders(),
  ])
  .then((imageAndShaders) => {
    const [, shaderContents] = imageAndShaders;
    const [fragmentShaderContent, vertexShaderContent] = shaderContents;
    const contrastMap = createContrastMap(
      contrastMapImage,
      fragmentShaderContent,
      vertexShaderContent
    );

    contrastMapContainer.appendChild(contrastMapImage);
    contrastMap.classList.add('contrast-map__overlay');
    contrastMapContainer.appendChild(contrastMap);
  })
  .catch((err) => {
    console.error('Something went terribly wrong', err);
  });
}
