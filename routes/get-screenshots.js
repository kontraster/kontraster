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
function getScreenshotFilename(key) {
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
function getScreenshotFilenames(key) {
  return [
    `${getScreenshotFilename(key)}-base.png`,
    `${getScreenshotFilename(key)}-headings.png`,
    `${getScreenshotFilename(key)}-text.png`,
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

  // Assign filenames to variables, for convenience
  const [
    screenshotBaseFileFileName,
    screenshotHeadingFileName,
    screenshotTextFileName,
  ] = getScreenshotFilenames(req.query.url);

  // Generate screenshots
  const screenshotProcess = spawn('npm', ['run', '--silent', 'screenshot', '--',
    req.query.url,
    path.join(screenshotDirectory, screenshotPath, screenshotBaseFileFileName),
    path.join(screenshotDirectory, screenshotPath, screenshotHeadingFileName),
    path.join(screenshotDirectory, screenshotPath, screenshotTextFileName),
  ], {
    stdio: 'ignore',
  });

  // Send response once the process is finished
  screenshotProcess.on('close', (code) => {
    if (code > 0) {
      screenshotProcess.kill();
      res.status(400).end();
      return;
    }

    // Submit a JSON response with paths to page renders
    res.send({
      base: `/${path.join(screenshotPath, screenshotBaseFileFileName)}`,
      headings: `/${path.join(screenshotPath, screenshotHeadingFileName)}`,
      text: `/${path.join(screenshotPath, screenshotTextFileName)}`,
    }).end();
  });
};
