const fs = require('fs');
const path = require('path');
const connect = require('connect');
const serve = require('serve-static');

const pathPublic = path.join(__dirname, '..', 'web');
const app = connect().use(serve(pathPublic));
let server;

const imageHeaders = {
	'Content-Type': 'image/png',
};

module.exports = {
	start(imageBase, imageText) {

		app.use('/image-base', (req, res, next) => {
			res.writeHead(200, imageHeaders);
			fs.createReadStream(imageBase).pipe(res);
		});

		app.use('/image-text', (req, res, next) => {
			res.writeHead(200, imageHeaders);
			fs.createReadStream(imageText).pipe(res);
		});

		return new Promise((resolve, reject) => {
			server = app.listen(0, '127.0.0.1', (err) => {
				if (err) return reject(err);

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
