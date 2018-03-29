const fs = require('fs');
const path = require('path');
const connect = require('connect');
const serve = require('serve-static');

const PATH_PUBLIC = path.join(__dirname, '..', 'web');

const createImageMiddleware = image => (req, res) => {
	res.writeHead(200, { 'content-type': 'image/png' });
	fs.createReadStream(image).pipe(res);
};

module.exports = class Server {
	getUrl() {
		if (!this.server) {
			throw new Error('Server has not been started yet.');
		}

		const address = this.server.address();

		return `http://${address.address}:${address.port}`;
	}

	start(imageBase, imageText, info) {
		this.app = connect().use(serve(PATH_PUBLIC));
		this.app.use('/image-base', createImageMiddleware(imageBase));
		this.app.use('/image-text', createImageMiddleware(imageText));
		this.app.use('/info', (req, res) => {
			res.writeHead(200, { 'content-type': 'application/json' });
			res.end(JSON.stringify(info));
		});

		return new Promise((resolve, reject) => {
			this.server = this.app.listen(0, '127.0.0.1', (err) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(this.getUrl());
			});
		});
	}

	stop() {
		if (this.server) this.server.close();

		return this;
	}
};
