const fetchImage = (url) => {
	const image = new Image();

	return new Promise((resolve, reject) => {
		image.addEventListener('load', function imageOnLoadHandler() {
			image.removeEventListener('load', imageOnLoadHandler);
			resolve(image);
		});

		image.addEventListener('error', err => reject(err.message));
		image.src = url;

		if (image.complete) {
			resolve(image);
		}
	});
};
