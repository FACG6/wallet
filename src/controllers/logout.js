exports.getLogout = (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
};
