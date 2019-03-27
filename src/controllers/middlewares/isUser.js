const checkUser = require('./../../database/queries/selectUser');

exports.checkUser = (req, res, next) => {
  checkUser.select(req.body.email.trim())
    .then((result) => {
      if (result.rows.rowCounts) {
        res.send(JSON.stringify({ error: 'Email Already Exists' }));
      } else {
        next();
      }
    })
    .catch(() => {
      res.send(JSON.stringify({ error: 'Internal Server Error play try agian later ' }));
    });
};
