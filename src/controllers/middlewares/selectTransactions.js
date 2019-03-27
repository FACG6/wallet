const selectTransactions = require('../../database/queries/selectTransactions');
const selectCatName = require('../../database/queries/selectCatName');

exports.getSpecificTransactions = (req, res, next) => {
  const catId = Number(req.params.id);
  const {
    planId,
    categoriesId,
  } = req.token;
  if (categoriesId.indexOf(catId) !== -1) {
    selectCatName(catId)
      .then((result) => {
        req.catName = result.rows[0].name;
        return selectTransactions(planId, catId);
      })
      .then((result) => {
        req.transactions = result.rows;
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else {
    res.redirect('/my-wallet');
  }
};
