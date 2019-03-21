exports.checkProtected = (req, res, next) => {
  if (req.token) {
    next();
  } else {
    res.redirect('/');
  }
};

exports.checkUnProtected = (req, res, next) => {
  if (req.token) {
    res.redirect('/my-wallet');
  } else {
    next();
  }
};

exports.checkMyWallet = (req, res, next) => {
  if (req.token) {
    next();
  } else {
    res.render('myWallet', { preTour: true, title: 'pre-tour', stylesheet: '/css/myWallet.css' });
  }
};
