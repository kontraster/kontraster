const path = require('path');
const fileExists = require('../functions/file-exists');

module.exports = class ImageAuditOptions {
	static get LEVELS() {
		return {
			AA: 4.5,
			AA_LARGE: 3,
			AAA: 7,
			AAA_LARGE: 4.5,
		};
	}

	static get OPTIONS_DEFAULT() {
		return {
			isLargeText: false,
			level: 'AA',
			output: './output.png',
			outputType: 'composition',
		};
	}

	static get OUTPUT_TYPES() {
		return [
			'COMPOSITION',
			'MASK',
		];
	}

	constructor(optionsUser = {}) {
		if (typeof optionsUser !== 'object') {
			throw new Error(`"${optionsUser}" should be an object.`);
		}

		const options = ImageAuditOptions.validateImageOptions(Object.assign(
			{},
			ImageAuditOptions.OPTIONS_DEFAULT,
			optionsUser,
		));

		this.contrastRatio = ImageAuditOptions.getContrastRatioThreshold(
			options.level,
			options.isLargeText,
		);

		this.imageBase = options.imageBase;
		this.imageText = options.imageText;
		this.output = options.output;
		this.outputType = options.outputType;
	}

	async validate() {
		if (!(await fileExists(this.imageBase))) {
			throw new Error(`The file "${this.imageBase}" does not exist.`);
		}
		if (!(await fileExists(this.imageText))) {
			throw new Error(`The file "${this.imageText}" does not exist.`);
		}
	}

	getUniforms() {
		return {
			contrastRatio: this.contrastRatio,
			outputType: this.outputType,
		};
	}

	static getContrastRatioThreshold(level, isLargeText = false) {
		const key = isLargeText ? `${level}_LARGE` : level;

		if (!this.isValidLevel(key)) {
			throw new Error(`${level} is not a valid level.`);
		}

		return ImageAuditOptions.LEVELS[key];
	}

	static isValidLevel(level) {
		if (typeof level !== 'string') return false;

		return Object.keys(ImageAuditOptions.LEVELS).includes(level.toUpperCase());
	}

	static isValidOutputType(outputType) {
		if (typeof outputType !== 'string') return false;

		return ImageAuditOptions.OUTPUT_TYPES.includes(outputType.toUpperCase());
	}

	static isValidPath(filePath) {
		return typeof filePath === 'string';
	}

	static normalizePath(filePath) {
		if (path.isAbsolute(filePath)) {
			return filePath;
		}

		return path.resolve(process.cwd(), filePath);
	}

	static validateImageOptions(options) {
		if (!ImageAuditOptions.isValidPath(options.imageBase)) {
			throw new Error(`"${options.imageBase}" is not an absolute path.`);
		}
		if (!ImageAuditOptions.isValidPath(options.imageText)) {
			throw new Error(`"${options.imageText}" is not an absolute path.`);
		}
		if (typeof options.isLargeText !== 'boolean') {
			throw new Error(`"${options.isLargeText}" must be "true" or "false".`);
		}

		if (!ImageAuditOptions.isValidLevel(options.level)) {
			throw new Error(`"${options.level}" is an invalid WCAG level. Please select any of the following: [${Object.keys(ImageAuditOptions.LEVELS).join(', ')}].`);
		}

		if (!ImageAuditOptions.isValidOutputType(options.outputType)) {
			throw new Error(`"${options.outputType}" is an invalid output type. Please select any of the following: [${ImageAuditOptions.OUTPUT_TYPES.join(', ')}].`);
		}

		return Object.assign({}, options, {
			imageBase: ImageAuditOptions.normalizePath(options.imageBase),
			imageText: ImageAuditOptions.normalizePath(options.imageText),
			level: options.level.toUpperCase(),
			output: ImageAuditOptions.normalizePath(options.output),
			outputType: options.outputType.toUpperCase(),
		});
	}
};
