const exec = require('child_process').exec;

const IMAGE_URL_PREFIX = 'data:image/png;base64,';
const EXEC_OPTIONS = {
  maxBuffer: Infinity,
};

module.exports = (req, res) => {
  exec(`npm run --silent screenshot -- ${req.body.url}`, EXEC_OPTIONS, (err, stdout) => {
    if (err) {
      console.error(err);
      return;
    }

    const buffer = new Buffer(stdout, 'base64');

    res.render('validate', {
      title: `validating ${req.body.url}`,
      validate: {
        url: req.body.url,
        screenshot: IMAGE_URL_PREFIX + buffer.toString('base64'),
      },
    });
  });
};
