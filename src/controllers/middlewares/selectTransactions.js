const selectTransaction = require('./../../database/queries/selectSpecificTransaction');

exports.show = (req, res, next) => {
  selectTransaction(req.params.category, req.token.id, req.token.planId)
    .then((file) => {
      req.row = file.rows;
      next();
    })
    .catch((err) => {
      next(err);
    });
};
