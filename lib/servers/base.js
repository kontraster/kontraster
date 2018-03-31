const path = require('path');
const connect = require('connect');
const serve = require('serve-static');

module.exports = class BaseServer {
	constructor(pathRoot, port = 0, hostname = '127.0.0.1') {
		if (!path.isAbsolute(pathRoot)) {
			throw new Error(`${path} is not an absolute path.`);
		}

		this.app = connect().use(serve(pathRoot));
		this.hostname = hostname;
		this.port = port;
		this.server = null;
	}

	addMiddleware(...args) {
		this.app.use(...args);

		return this;
	}

	getUrl() {
		const address = this.server.address();

		return `http://${address.address}:${address.port}`;
	}

	start() {
		return new Promise((resolve, reject) => {
			this.server = this.app.listen(this.port, this.hostname, (err) => {
				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
	}

	stop() {
		if (this.server) {
			this.server.close();
		}

		return this;
	}
};
