const fetchImage = (url) => {
	const image = new Image();

  return new Promise((resolve, reject) => {
    if (image.complete) return resolve(image);

    image.addEventListener('load', function imageOnLoadHandler() {
      image.removeEventListener('load', imageOnLoadHandler);
      resolve(image);
    });

		image.addEventListener('error', (err) => reject(err.message));

		image.src = url;
  });
};

const fetchGetText = res => res.text();

Promise.all([
	fetchImage('/image-base'),
	fetchImage('/image-text'),
	fetch('/assets/shaders/contrast-map.frag.glsl').then(fetchGetText),
	fetch('/assets/shaders/contrast-map.vert.glsl').then(fetchGetText),
])
	.then((imagesAndShaders) => {
		const contrastMap = createContrastMap(...imagesAndShaders);

		document.body.appendChild(contrastMap.canvas);
	})
	.catch(err => console.error(err.message));
