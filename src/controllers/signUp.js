exports.getSignUp = (req, res) => {
  res.render('signUp', {
    title: 'Wallet || Signup',
    script: 'signUpDom.js',
    stylesheet: 'signUp.css',
  });
};

exports.postSignUp = (req, res) => {
  res.send({ state: true });
};
