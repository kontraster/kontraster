const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const UrlValidator = require('valid-url');

function getFilename(key) {
  const hash = crypto.createHash('md5');
  hash.update(key);
  return hash.digest('hex');
}

module.exports = (req, res) => {
  res.set('Content-Type', 'image/png');

  if (!UrlValidator.isUri(req.query.url)) {
    res.status(400).end();
    return;
  }

  const screenshotPath = path.resolve(`${__dirname}/../.screenshot-cache/${getFilename(req.query.url)}.png`);
  const screenshotProcess = spawn('npm', ['run', '--silent', 'screenshot', '--', req.query.url, screenshotPath], {
    stdio: 'ignore',
  });

  screenshotProcess.on('close', (code) => {
    if (code > 0) {
      screenshotProcess.kill();
      res.status(400).end();
      return;
    }

    fs.stat(screenshotPath, (err, stats) => {
      res.set('Content-Length', stats.size);

      res.sendFile(screenshotPath, {}, (screenshotSendError) => {
        if (screenshotSendError) {
          console.error('Unable to send file', screenshotPath);
        }

        fs.unlink(screenshotPath, (screenshotDeleteError) => {
          if (screenshotDeleteError) {
            console.error('Unable to delete', screenshotPath);
          }
        });
      });
    });
  });
};
