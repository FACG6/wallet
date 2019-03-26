const selectCategories = require('../../database/queries/selectCategories');

module.exports = (req, res, next) => {
  selectCategories()
    .then((result) => {
      req.categories = result.rows;
      next();
    })
    .catch(() => res.send({ state: 'ERR', reason: 'server' }));
};
