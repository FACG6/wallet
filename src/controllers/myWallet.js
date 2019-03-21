const moment = require('moment');
const selectPaln = require('../database/queries/selectPlan');

exports.get = (req, res, next) => {
  selectPaln.select(req.token.id)
    .then((result) => {
      const data = result.rows[0];
      const start = result.rows[0].starting;
      const end = result.rows[0].ending;
      const today = moment();
      if (today.isBetween(moment(start), moment(end))) {
        res.render('myWallet', {
          disable: true,
          income: data.income,
          totalExpenses: data.totalexp,
          totalPercentage: data.totalpercentage,
          colorIncome: data.incomecolor,
          categories: result.rows,
          title: 'My Wallet',
          stylesheet: '/css/myWallet.css',
        });
      } else {
        res.render('myWallet', {
          title: 'My Wallet',
          stylesheet: '/css/myWallet.css',
        });
      }
    })
    .catch((error) => {
      next(error);
    });
};
