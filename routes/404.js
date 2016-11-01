/**
 * The route to serve a 404 page.
 *
 * @param {Object} req - The route’s request object.
 * @param {Object} res - The route’s response object.
 */
module.exports = (req, res) => res.status(404).end();
