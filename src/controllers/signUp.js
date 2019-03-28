exports.getSignUp = (req, res) => {
  res.render('signUp', {
    title: 'Wallet || Signup',
    script: 'signUpDom.js',
    stylesheet: 'sign.css',
  });
};

exports.postSignUp = (req, res) => {
  res.send({ state: true });
};
