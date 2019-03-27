exports.get = (req, res) => {
  res.render('signUp', { stylesheet: 'sign.css' });
};
exports.post = (req, res) => {
  res.send(JSON.stringify({ done: true }));
};
