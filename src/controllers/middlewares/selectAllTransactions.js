const selectAllTransactions = require('../../database/queries/selectAllTransactions');

module.exports = (req, res, next) => {
  const {
    planId,
  } = req.token;
  selectAllTransactions(planId)
    .then((results) => {
      req.transactions = results.rows;
      next();
    })
    .catch(err => next(err));
};
