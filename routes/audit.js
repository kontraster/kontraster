const UrlValidator = require('valid-url');

/**
 * The route to audit a webpage.
 *
 * @param {Object} req - The route’s request object.
 * @param {Object} res - The route’s response object.
 */
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
    viewParameters.validate.imageUrl = `/get-screenshots?url=${encodeURIComponent(req.query.url)}`;
  } else {
    viewParameters.error = 'URL is invalid.';
  }

  res.render('audit', viewParameters);
};
