const selectPaln = require('../database/queries/selectPlan');
const { createCookie } = require('./middlewares/createCookie');

exports.get = (req, res, next) => {
  selectPaln.select(req.token.id)
    .then((result) => {
      if (!result.rowCount) {
        res.render('myWallet', {
          username: req.token.username,
          loggedIn: true,
          title: 'My Wallet',
          stylesheet: 'myWallet.css',
          username: req.token.username,
        });
        return '';
      }
      const data = result.rows[0];
      const start = result.rows[0].starting;
      const end = result.rows[0].ending;
      const today = new Date();
      if (today >= new Date(start) && today <= new Date(end)) {
        const categoriesId = result.rows.map(row => row.categoryid);
        const jwt = createCookie({
          id: req.token.id,
          username: req.token.username,
          planId: result.rows[0].planid,
          start,
          end,
          categoriesId,
        });
        res.cookie('jwt', jwt, {
          maxAge: 1000 * 60 * 60 * 2,
          httpOnly: true,
        });
        res.render('myWallet', {
          loggedIn: true,
          disable: true,
          income: data.income,
          totalExpenses: data.totalexp,
          totalPercentage: data.totalpercentage,
          colorIncome: data.incomecolor,
          categories: result.rows,
          title: 'My Wallet',
          stylesheet: 'myWallet.css',
          script: 'myWalletDom.js',
          username: req.token.username,
          start,
          end,
        });
      } else {
        res.render('myWallet', {
          loggedIn: false,
          title: 'My Wallet',
          stylesheet: 'myWallet.css',
        });
      }
    })
    .catch((error) => {
      next(error);
    });
};
