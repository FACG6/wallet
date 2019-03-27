const { checkEmail } = require('../../database/queries/checkEmail');

exports.checkEmailExist = (req, res, next) => {
  checkEmail(req.body.email)
    .then((result) => {
      if (!result.rowCount) {
        next();
      } else {
        res.send({ error: 'Email is already used !!' });
      }
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal Servar Error!!' });
    });
};
