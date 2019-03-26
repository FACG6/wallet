const { sign, verify } = require('jsonwebtoken');

exports.isLogged = (req, res, next) => {
  if (req.token) {
    req.loggedIn = true;
    next();
  } else {
    req.loggedIn = false;
    next();
  }
};

exports.checkPlan = (req, res, next) => {
  if (!req.token) {
    res.status(401).send({
      state: 'ERR',
      reason: 'login',
    });
  } else if (req.token && req.token.planId) {
    res.status(401).send({
      state: 'ERR',
      reason: 'HasPlan',
    });
  } else {
    next();
  }
};

exports.checkSession = (req, res, next) => {
  if (req.cookies.session) {
    verify(req.cookies.session, process.env.SECRET, (err, decoded) => {
      if (err) {
        req.clearCookie('session');
        res.send({ state: 'ERR', reason: 'server' });
      } else {
        req.session = decoded;
        next();
      }
    });
  } else {
    res.status(401).send({ state: 'ERR', reason: 'No Income' });
  }
};

exports.createSession = (req, res, next) => {
  const {
    planData,
  } = req;
  const session = sign(planData, process.env.SECRET);
  res.cookie('session', session, {
    httpOnly: true,
  });
  next();
};

