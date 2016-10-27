const UrlValidator = require('valid-url');

module.exports = (req, res) => {
  const viewParameters = {
    title: `validating ${req.query.url}`,
    validate: {
      url: req.query.url,
      imageUrl: null,
    },
    error: null,
  };

  if (UrlValidator.isUri(req.query.url)) {
    viewParameters.validate.imageUrl = `/get-screenshot?url=${encodeURIComponent(req.query.url)}`;
  } else {
    viewParameters.error = 'URL is invalid.';
  }

  res.render('validate', viewParameters);
};
