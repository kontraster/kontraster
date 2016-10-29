const crypto = require('crypto');
const path = require('path');
const spawn = require('child_process').spawn;
const UrlValidator = require('valid-url');

const screenshotDirectory = path.resolve(`${__dirname}/../public`);
const screenshotPath = 'screenshots';

function getFilename(key) {
  const hash = crypto.createHash('md5');
  hash.update(key);
  return hash.digest('hex');
}

function getFilenames(key) {
  return [
    `${getFilename(key)}.png`,
    `${getFilename(key)}-without-text.png`,
  ];
}

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
