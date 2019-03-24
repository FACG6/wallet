exports.getBudget = (req, res) => {
  res.render('budget', {
    title: 'Wallet || Plan',
    stylesheet: '/css/budget.css',
    script: '/js/budgetDom.js',
  });
};

exports.getPlan = (req, res) => {
  const { categoriesListOne } = req;
  const { categoriesListTwo } = req;
  res.render('plan', {
    title: 'Wallet || Plan',
    stylesheet: '/css/plan.css',
    script: '/js/planDom.js',
    categoriesListOne,
    categoriesListTwo,
  });
};
