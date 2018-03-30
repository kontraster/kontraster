const fs = require('fs');
const Webserver = require('../webserver');

const createImageMiddleware = image => (req, res) => {
	res.writeHead(200, { 'content-type': 'image/png' });
	fs.createReadStream(image).pipe(res);
};

module.exports = class CompareImageServer {
	constructor(pathRoot, imageBase, imageText, info) {
		this.server = new Webserver(pathRoot)
			.addMiddleware('/image-base', createImageMiddleware(imageBase))
			.addMiddleware('/image-text', createImageMiddleware(imageText))
			.addMiddleware('/info', (req, res) => {
				res.writeHead(200, { 'content-type': 'application/json' });
				res.end(JSON.stringify(info));
			});
	}

	start() {
		this.server.start();

		return this;
	}

	getUrl() {
		return this.server.getUrl();
	}

	stop() {
		this.server.stop();

		return this;
	}
};
