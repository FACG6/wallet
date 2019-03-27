const { insert } = require('../../database/queries/insertUser');
const { createCookie } = require('./createCookie');

exports.addUser = (req, res, next) => {
  const {
    username, password, email,
  } = req.body;

  insert(username, password, email)
    .then((result) => {
      const payload = {
        id: result.rows[0].id,
        username: result.rows[0].username,
      };
      const jwt = createCookie(payload);
      res.cookie('jwt', jwt, {
        maxAge: 1000 * 60 * 60 * 2,
        httpOnly: true,
      });
      next();
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal Servar Error!!' });
    });
};
