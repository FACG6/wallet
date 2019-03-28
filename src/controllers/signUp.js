exports.getSignUp = (req, res) => {
  res.render('signUp', { script: 'signUpDom.js', stylesheet: 'sign.css', layout: 'main' });
};

exports.postSignUp = (req, res) => {
  res.send({ state: true });
};
