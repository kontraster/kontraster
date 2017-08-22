const levels = {
	AA: {
		plain: 4.5,
		large: 3,
	},

	AAA: {
		plain: 7,
		large: 4.5,
	},
};

const validLevels = ['AA', 'AAA'];

module.exports = {
	getContrastRatioThreshold(level, isLargeText = false) {
		if (!this.isValid(level)) {
			throw new Error(`${level} is not a valid WCAG level`);
		}

		const type = isLargeText ? 'large': 'plain';
		return levels[level][type];
	},

	isValid(level) {
		return Object.keys(levels)
			.includes(level);
	},
};
