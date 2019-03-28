exports.get = (req, res) => {
  res.render('allTransactions', {
    title: 'All Your Transactios',
    stylesheet: 'transactions.css',
    loggedIn: true,
    transactions: req.transactions,
    username: req.token.username,
    script: 'transactionsDom.js',
  });
};
