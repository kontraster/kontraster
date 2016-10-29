/* global fetch */
import 'whatwg-fetch';

const createContrastMap = require('./contrast-map');
const fetchShaders = require('./fetch-shaders');
const imageOnLoad = require('./image-on-load');

const contrastMapContainer = document.querySelector('.js-contrast-map');

function fetchImage(url) {
  const image = new Image();
  image.src = url;
  return imageOnLoad(image);
}

function getScreenshotImages(screenshotsUrl) {
  return new Promise((resolve, reject) => {
    fetch(screenshotsUrl)
    .then(response => response.json())
    .then(data => Promise.all([
      fetchImage(data.screenshotUrl),
      fetchImage(data.screenshotWithoutTextUrl),
    ]))
    .then(resolve)
    .catch(reject);
  });
}

if (contrastMapContainer) {
  let contrastMapImage;
  let contrastMapImageWithoutText;

  getScreenshotImages(contrastMapContainer.getAttribute('data-contrast-image-url'))
  .then((images) => {
    [contrastMapImage, contrastMapImageWithoutText] = images;
    contrastMapImage.classList.add('contrast-map__image');

    return Promise.all([
      fetchShaders(),
      imageOnLoad(contrastMapImage),
      imageOnLoad(contrastMapImageWithoutText),
    ]);
  }, err => console.error('Unable to get screenshots', err))
  .then((shadersAndImages) => {
    const [shaderContents] = shadersAndImages;
    const [fragmentShaderContent, vertexShaderContent] = shaderContents;
    const contrastMap = createContrastMap(
      contrastMapImage,
      contrastMapImageWithoutText,
      fragmentShaderContent,
      vertexShaderContent
    );

    contrastMapContainer.appendChild(contrastMapImage);
    contrastMap.canvas.classList.add('contrast-map__overlay');
    contrastMapContainer.appendChild(contrastMap.canvas);
    contrastMapContainer.classList.add('contrast-map--ready');

    // TODO: Analyse canvas.pixels for data and to give user advice
  }, err => console.error('Unable to generate contrast map', err));
}
