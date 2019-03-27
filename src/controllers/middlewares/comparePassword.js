const bcrypt = require('bcrypt');

exports.compare = (req, res, next) => {
  bcrypt.compare(req.body.password, req.userInfo.password, (error, sucess) => {
    if (error) {
      res.status(500).send({ error: 'Internal Server Error' });
    } else if (sucess) next();
    else res.send({ error: 'Email or password wrong' });
  });
};
