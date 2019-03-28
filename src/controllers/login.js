const { createCookie } = require('./middlewares/createCookie');

exports.get = (req, res) => {
  res.render('login', { stylesheet: 'sign.css', script: 'loginDom.js' });
};
exports.post = (req, res) => {
  const { id, username } = req.userInfo;
  const jwt = createCookie({ id, username });
  res.cookie('jwt', jwt, {
    maxAge: 1000 * 60 * 60 * 2,
    httpOnly: true,
  });
  res.send({ result: true });
};
