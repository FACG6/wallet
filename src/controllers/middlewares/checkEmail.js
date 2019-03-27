const { select } = require('../../database/queries/selectUser');

exports.checkEmail = (req, res, next) => {
  select(req.body.email)
    .then((result) => {
      if (!result.rowCount) {
        res.status(401).send({ error: 'Email or password wrong' });
      } else {
        req.userInfo = {
          id: result.rows[0].id,
          username: result.rows[0].name,
          password: result.rows[0].password,
        };
        next();
      }
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal Server Error' });
    });
};
