exports.getTransactionsPage = (req, res) => {
  res.render('transactions', {
    stylesheet: 'transactions.css',
    title: 'Your Transactions',
    loggedIn: true,
    catName: req.catName,
    transactions: req.transactions,
    username: req.token.username,
    script: 'transactionsDom.js',
  });
};
