const selectCategories = require('../../database/queries/selectCategories');

module.exports = (req, res, next) => {
  selectCategories()
    .then((result) => {
      const length = Math.round(result.rows.length / 2);
      req.categoriesListOne = result.rows.slice(0, length);
      req.categoriesListTwo = result.rows.slice(length);
      next();
    })
    .catch(() => res.send({ state: 'ERR', reason: 'server'}));
};
