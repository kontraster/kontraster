const fs = require('fs');
const path = require('path');
const connect = require('connect');
const serve = require('serve-static');

const pathPublic = path.join(__dirname, '..', 'web');
const app = connect().use(serve(pathPublic));
let server;

const headersText = {
	'content-type': 'plain/text',
};

const headersImage = {
	'content-type': 'image/png',
};

module.exports = {
	start(imageBase, imageText, minContrastRatio) {
		app.use('/image-base', (req, res) => {
			res.writeHead(200, headersImage);
			fs.createReadStream(imageBase).pipe(res);
		});

		app.use('/image-text', (req, res) => {
			res.writeHead(200, headersImage);
			fs.createReadStream(imageText).pipe(res);
		});

		app.use('/contrast-ratio', (req, res) => {
			res.writeHead(200, headersText);
			res.end(minContrastRatio.toFixed(1));
		});

		return new Promise((resolve, reject) => {
			server = app.listen(0, '127.0.0.1', (err) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(this.getUrl());
			});
		});
	},

	getUrl() {
		const address = server.address();

		return `http://${address.address}:${address.port}`;
	},

	stop() {
		server.close();
	},
};
