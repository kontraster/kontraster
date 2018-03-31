const fs = require('fs');
const BaseServer = require('./base');

const createImageMiddleware = image => (req, res) => {
	res.writeHead(200, { 'content-type': 'image/png' });
	fs.createReadStream(image).pipe(res);
};

module.exports = class CompareImageServer extends BaseServer {
	constructor(pathRoot, imageBase, imageText, info) {
		super(pathRoot);

		this
			.addMiddleware('/image-base', createImageMiddleware(imageBase))
			.addMiddleware('/image-text', createImageMiddleware(imageText))
			.addMiddleware('/info', (req, res) => {
				res.writeHead(200, { 'content-type': 'application/json' });
				res.end(JSON.stringify(info));
			});
	}
};
