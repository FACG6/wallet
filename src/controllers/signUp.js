exports.getSignUp = (req, res) => {
  res.render('signUp', { script: 'signUpDom.js', stylesheet: 'signUp.css', layout: 'main' });
};

exports.postSignUp = (req, res) => {
  res.send({ state: true });
};
