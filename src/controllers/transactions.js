exports.get = (req, res) => {
  res.render('transactions', { stylesheet: 'css/transacation.css', specificTransacation: req.row });
};
