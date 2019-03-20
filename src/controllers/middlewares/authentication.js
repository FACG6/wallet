const { verify } = require('jsonwebtoken');

exports.check = (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    verify(req.cookies.jwt, process.env.SECRET, (err, payload) => {
      if (err) {
        res.clearCookie('jwt');
        res.redirect('/');
      } else {
        req.token = payload;
        next();
      }
    });
  } else {
    next();
  }
};
