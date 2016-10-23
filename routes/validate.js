module.exports = (req, res) => {
  res.render('validate', {
    title: `validating ${req.body.url}`,
    validate: {
      url: req.body.url,
      screenshot: 'foo',
    },
  });
};
