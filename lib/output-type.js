const outputTypes = {
	composition: 'IS_COMPOSITION',
	mask: 'IS_MASK',
};

module.exports = {
	getError(value) {
		return new Error(`${value} is not a valid output type`);
	},

	getShaderConstant(outputType) {
		if (!this.isValid(outputType)) {
			throw new Error(this.getError(outputType));
		}

		return outputTypes[outputType];
	},

	isValid(outputType) {
		return Object.keys(outputTypes)
			.includes(outputType);
	},
};
