import test from 'ava';
import ImageAuditOptions from './image-audit';

test('ImageAuditOptions.constructor', (t) => {
	t.throws(() => new ImageAuditOptions(1));
	t.throws(() => new ImageAuditOptions({}));
	t.notThrows(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
	}));

	t.throws(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		outputType: 'baz',
	}));

	t.throws(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		outputType: 'baz',
	}));
});

test('ImageAuditOptions.constructor level', (t) => {
	t.throws(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		level: 4,
	}));

	t.throws(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		level: 'INVALID',
	}));

	t.notThrows(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		level: 'AAA',
	}));

	t.is(new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
	}).contrastRatio, ImageAuditOptions.LEVELS.AA);
});

test('ImageAuditOptions.constructor isLargeText', (t) => {
	t.throws(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		isLargeText: 1,
	}));

	t.notThrows(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		isLargeText: true,
	}));
});

test('ImageAuditOptions.constructor outputType', (t) => {
	t.throws(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		outputType: 1,
	}));

	t.throws(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		outputType: '',
	}));

	t.notThrows(() => new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		outputType: 'composition',
	}));
});

test('ImageAuditOptions.getUniforms', (t) => {
	t.deepEqual(new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
	}).getUniforms(), {
		contrastRatio: ImageAuditOptions.LEVELS.AA,
		outputType: 'COMPOSITION',
	});

	t.deepEqual(new ImageAuditOptions({
		imageBase: 'foo',
		imageText: 'bar',
		level: 'AAA',
		outputType: 'mask',
	}).getUniforms(), {
		contrastRatio: ImageAuditOptions.LEVELS.AAA,
		outputType: 'MASK',
	});
});

test.todo('ImageAuditOptions.getContrastRatioThreshold');
test.todo('ImageAuditOptions.isValidLevel');
test.todo('ImageAuditOptions.isValidOutputType');
test.todo('ImageAuditOptions.isValidPath');
test.todo('ImageAuditOptions.normalizePath');
test.todo('ImageAuditOptions.validateImageOptions');
