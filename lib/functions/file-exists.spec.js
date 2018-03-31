import path from 'path';
import test from 'ava';

import fileExists from './file-exists';

test('fileExists', async (t) => {
	t.true(await fileExists(path.resolve(__dirname, 'file-exists.js')));
	t.false(await fileExists(path.resolve(__dirname, 'non-existing-file')));
});
