const fs = require('fs');
const path = require('path');
const connect = require('connect');
const serve = require('serve-static');

const pathPublic = path.join(__dirname, '..', 'web');
const app = connect().use(serve(pathPublic));
let server;

const headersJson = {
	'content-type': 'application/json',
};

const headersImage = {
	'content-type': 'image/png',
};

module.exports = {
	getUrl() {
		const address = server.address();

		return `http://${address.address}:${address.port}`;
	},

	start(imageBase, imageText, info) {
		app.use('/image-base', (req, res) => {
			res.writeHead(200, headersImage);
			fs.createReadStream(imageBase).pipe(res);
		});

		app.use('/image-text', (req, res) => {
			res.writeHead(200, headersImage);
			fs.createReadStream(imageText).pipe(res);
		});

		app.use('/info', (req, res) => {
			res.writeHead(200, headersJson);
			res.end(JSON.stringify(info));
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

	stop() {
		server.close();
	},
};
