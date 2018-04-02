import path from 'path';
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

test('ImageAuditOptions.getContrastRatioThreshold', (t) => {
	t.is(ImageAuditOptions.getContrastRatioThreshold('AA'), ImageAuditOptions.LEVELS.AA);
	t.is(ImageAuditOptions.getContrastRatioThreshold('AA', true), ImageAuditOptions.LEVELS.AA_LARGE);
	t.is(ImageAuditOptions.getContrastRatioThreshold('AAA'), ImageAuditOptions.LEVELS.AAA);
	t.is(ImageAuditOptions.getContrastRatioThreshold('AAA', true), ImageAuditOptions.LEVELS.AAA_LARGE);

	t.throws(() => ImageAuditOptions.getContrastRatioThreshold('FOO'));
	t.throws(() => ImageAuditOptions.getContrastRatioThreshold('FOO', true));
});

test('ImageAuditOptions.isValidLevel', (t) => {
	t.true(ImageAuditOptions.isValidLevel('AA'));
	t.true(ImageAuditOptions.isValidLevel('AAA'));

	t.false(ImageAuditOptions.isValidLevel());
	t.false(ImageAuditOptions.isValidLevel(4));
	t.false(ImageAuditOptions.isValidLevel('BB'));
	t.false(ImageAuditOptions.isValidLevel('BBB'));
});

test('ImageAuditOptions.isValidOutputType', (t) => {
	t.true(ImageAuditOptions.isValidOutputType('composition'));
	t.true(ImageAuditOptions.isValidOutputType('COMPOSITION'));
	t.true(ImageAuditOptions.isValidOutputType('mask'));
	t.true(ImageAuditOptions.isValidOutputType('MASK'));

	t.false(ImageAuditOptions.isValidOutputType('foo'));
	t.false(ImageAuditOptions.isValidOutputType('FOO'));
	t.false(ImageAuditOptions.isValidOutputType());
	t.false(ImageAuditOptions.isValidOutputType(1));
});

test('ImageAuditOptions.isValidPath', (t) => {
	t.true(ImageAuditOptions.isValidPath('/foo'));
	t.true(ImageAuditOptions.isValidPath('~/foo'));
	t.true(ImageAuditOptions.isValidPath('C:\\foo'));
	t.true(ImageAuditOptions.isValidPath('./foo'));
	t.true(ImageAuditOptions.isValidPath('foo'));

	t.false(ImageAuditOptions.isValidPath());
	t.false(ImageAuditOptions.isValidPath(1));
});

test('ImageAuditOptions.normalizePath', (t) => {
	const cwd = process.cwd();

	// Relative paths
	t.is(ImageAuditOptions.normalizePath('foo'), `${cwd}${path.sep}foo`);

	// Absolute paths
	t.is(ImageAuditOptions.normalizePath('/foo'), '/foo');
	t.is(ImageAuditOptions.normalizePath('C:\\foo'), 'C:\\foo');
});

test('ImageAuditOptions.validateImageOptions', (t) => {
	const createOptions = optionsUser => Object.assign({
		imageBase: 'foo',
		imageText: 'bar',
		isLargeText: false,
		level: 'AA',
		output: './output.png',
		outputType: 'composition',
	}, optionsUser);

	t.notThrows(() => ImageAuditOptions.validateImageOptions(createOptions({ imageBase: 'foo' })));
	t.throws(() => ImageAuditOptions.validateImageOptions(createOptions({ imageBase: 1337 })));

	t.notThrows(() => ImageAuditOptions.validateImageOptions(createOptions({ imageText: 'foo' })));
	t.throws(() => ImageAuditOptions.validateImageOptions(createOptions({ imageText: 1337 })));

	t.notThrows(() => ImageAuditOptions.validateImageOptions(createOptions({ isLargeText: true })));
	t.notThrows(() => ImageAuditOptions.validateImageOptions(createOptions({ isLargeText: false })));
	t.throws(() => ImageAuditOptions.validateImageOptions(createOptions({ isLargeText: 1337 })));

	t.notThrows(() => ImageAuditOptions.validateImageOptions(createOptions({ level: 'AA' })));
	t.throws(() => ImageAuditOptions.validateImageOptions(createOptions({ level: 'FOO' })));
	t.throws(() => ImageAuditOptions.validateImageOptions(createOptions({ level: 123 })));

	t.notThrows(() => ImageAuditOptions.validateImageOptions(createOptions({ output: 'foo' })));
	t.throws(() => ImageAuditOptions.validateImageOptions(createOptions({ output: 123 })));

	t.notThrows(() => ImageAuditOptions.validateImageOptions(createOptions({ outputType: 'composition' })));
	t.throws(() => ImageAuditOptions.validateImageOptions(createOptions({ outputType: 'foo' })));
	t.throws(() => ImageAuditOptions.validateImageOptions(createOptions({ outputType: 123 })));
});
