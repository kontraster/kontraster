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

module.exports = {
	getError(value) {
		return `${value} is not a valid WCAG level`;
	},

	getContrastRatioThreshold(level, isLargeText = false) {
		if (!this.isValid(level)) {
			throw new Error(this.getError(level));
		}

		const type = isLargeText ? 'large': 'plain';
		return levels[level][type];
	},

	isValid(level) {
		return Object.keys(levels)
			.includes(level);
	},
};
