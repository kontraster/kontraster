const crypto = require('crypto');
const path = require('path');
const spawn = require('child_process').spawn;
const UrlValidator = require('valid-url');

const screenshotDirectory = path.resolve(`${__dirname}/../public`);
const screenshotPath = 'screenshots';

/**
 * Create a filename for a screenshot.
 *
 * @param {String} key - A identifier used to generate a filename.
 * @return {String}
 */
function getFilename(key) {
  const hash = crypto.createHash('md5');
  hash.update(key);
  return hash.digest('hex');
}

/**
 * Creates a list of filenames for different types of screenshots.
 *
 * @param {String} key - A identifier used to generate a filename.
 * @return {Array}
 */
function getFilenames(key) {
  return [
    `${getFilename(key)}.png`,
    `${getFilename(key)}-without-text.png`,
  ];
}

/**
 * Controller to generate, save and serve screenshots.
 *
 * 1. Generate filenames for screenshots
 * 2. Run command to generate screenshots
 * 3. Serve screenshots
 *
 * @param {Object} req - The route’s request object.
 * @param {Object} res - The route’s response object.
 */
module.exports = (req, res) => {
  res.set('Content-Type', 'application/json');

  if (!UrlValidator.isUri(req.query.url)) {
    res.status(400).end();
    return;
  }

  const [screenshotFileName, screenshotFileNameWithoutText] = getFilenames(req.query.url);
  const screenshotProcess = spawn('npm', ['run', '--silent', 'screenshot', '--',
    req.query.url,
    path.join(screenshotDirectory, screenshotPath, screenshotFileName),
    path.join(screenshotDirectory, screenshotPath, screenshotFileNameWithoutText),
  ], {
    stdio: 'ignore',
  });

  screenshotProcess.on('close', (code) => {
    if (code > 0) {
      screenshotProcess.kill();
      res.status(400).end();
      return;
    }

    res.send({
      screenshotUrl: `/${path.join(screenshotPath, screenshotFileName)}`,
      screenshotWithoutTextUrl: `/${path.join(screenshotPath, screenshotFileNameWithoutText)}`,
    }).end();
  });
};
