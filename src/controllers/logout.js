exports.getLogout = (req, res) => {
  res.clearCookie('jwt', 'session');
  res.redirect('/');
};
