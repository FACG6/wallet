exports.getBudget = (req, res) => {
  if (req.loggedIn) {
    return res.render('budget', {
      title: 'Wallet || Plan',
      stylesheet: 'budget.css',
      script: 'budgetDom.js',
      loggedIn: true,
      username: req.token.username,
    });
  }
  res.render('budget', {
    title: 'Wallet || Plan',
    stylesheet: 'budget.css',
    script: 'budgetDom.js',
    loggedIn: false,
  });
};

exports.getPlan = (req, res) => {
  const {
    categories,
  } = req;
  if (req.loggedIn) {
    return res.render('plan', {
      title: 'Wallet || Plan',
      stylesheet: 'plan.css',
      script: 'planDom.js',
      loggedIn: true,
      username: req.token.username,
      categories,
    });
  }
  res.render('plan', {
    title: 'Wallet || Plan',
    stylesheet: 'plan.css',
    script: 'planDom.js',
    loggedIn: false,
    categories,
  });
};

exports.postIncome = (req, res) => {
  res.send({
    login: true,
    state: 'success',
  });
};

exports.postPlan = (req, res) => {
  res.send({
    login: true,
    state: 'success',
  });
};
