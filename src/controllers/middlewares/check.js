exports.checkProtected = (res, req, next) => {
  if (req.token) {
    next();
  } else {
    res.redirect('/');
  }
};

exports.checkUnProtected = (res, req, next) => {
  if (req.token) {
    res.redirect('/my-wallet');
  } else {
    next();
  }
};
