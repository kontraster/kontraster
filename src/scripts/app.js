/* global fetch */
import 'whatwg-fetch';

const createContrastMap = require('./contrast-map');
const fetchShaders = require('./fetch-shaders');
const imageOnLoad = require('./image-on-load');

/**
 * Get an image via a Promise.
 * @param {String} url - The image’s URL.
 * @return {Promise}
 */
function fetchImage(url) {
  const image = new Image();
  image.src = url;
  return imageOnLoad(image);
}

/**
 * Fetches the screenshots required to create a contrast map.
 * - Fetches a JSON file containing URLs to the screenshots
 * - Loads screenshots as images
 *
 * @param {String} screenshotsUrl - The screenshot URL.
 * @return {Promise}
 */
function getScreenshotImages(screenshotsUrl) {
  return new Promise((resolve, reject) => {
    fetch(screenshotsUrl)
    .then(response => response.json())
    .then(screenshotUrls => Promise.all([
      fetchImage(screenshotUrls.base),
      fetchImage(screenshotUrls.headings),
      fetchImage(screenshotUrls.text),
    ]))
    .then(resolve)
    .catch(reject);
  });
}

const contrastMapContainer = document.querySelector('.js-contrast-map');

// Only initialize contrast map contrastMapContainer exists in document
if (contrastMapContainer) {
  let contrastMapImageBase;
  let contrastMapImageHeadings;
  let contrastMapImageText;

  // Fetch the images the client should load for the contrast map
  getScreenshotImages(contrastMapContainer.getAttribute('data-contrast-image-url'))
  .then((images) => {
    [contrastMapImageBase, contrastMapImageHeadings, contrastMapImageText] = images;
    contrastMapImageBase.classList.add('contrast-map__image');

    // Load required images and shaders
    return Promise.all([
      fetchShaders(),
      imageOnLoad(contrastMapImageBase),
      imageOnLoad(contrastMapImageHeadings),
      imageOnLoad(contrastMapImageText),
    ]);
  }, err => console.error('Unable to get screenshots', err))

  // After images and shaders are loaded, use those create the contrast map
  .then((shadersAndImages) => {
    // Assign Promise.all() array response to variables for convenience
    const [shaderContents] = shadersAndImages;
    const [fragmentShaderContent, vertexShaderContent] = shaderContents;

    // Create the contrast map
    const contrastMap = createContrastMap(
      contrastMapImageBase,
      contrastMapImageHeadings,
      contrastMapImageText,
      fragmentShaderContent,
      vertexShaderContent
    );

    // Show contrast map on the document
    contrastMapContainer.appendChild(contrastMapImageBase);
    contrastMap.canvas.classList.add('contrast-map__overlay');
    contrastMapContainer.appendChild(contrastMap.canvas);
    contrastMapContainer.classList.add('contrast-map--ready');

    // TODO: Analyse canvas.pixels for data and to give user advice
  }, err => console.error('Unable to generate contrast map', err));
}
