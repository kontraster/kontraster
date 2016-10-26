const exec = require('child_process').exec;
const UrlValidator = require('valid-url');

const IMAGE_URL_PREFIX = 'data:image/png;base64,';
const EXEC_OPTIONS = {
  maxBuffer: Infinity,
};

module.exports = (req, res) => {
  const viewParameters = {
    title: `validating ${req.query.url}`,
    validate: { url: req.query.url },
    error: null,
  };

  const done = () => {
    const template = viewParameters.error ? 'index' : 'validate';
    res.render(template, viewParameters);
  };

  if (UrlValidator.isUri(req.query.url)) {
    exec(`npm run --silent screenshot -- ${req.query.url}`, EXEC_OPTIONS, (err, stdout) => {
      if (err) {
        viewParameters.error = `Unable to fetch ${req.query.url}.`;
      } else {
        const buffer = new Buffer(stdout, 'base64');
        viewParameters.validate.screenshot = IMAGE_URL_PREFIX + buffer.toString('base64');
      }

      done();
    });
  } else {
    viewParameters.error = 'URL is invalid.';
    done();
  }
};
