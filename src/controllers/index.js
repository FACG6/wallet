const express = require('express');

const {
  check,
} = require('./middlewares/authentication');
const {
  checkUnProtected,
  checkProtected,
} = require('./middlewares/check');
const home = require('../controllers/home');
const MyWallet = require('./myWallet');
const {
  checkMyWallet,
} = require('./middlewares/check');
const postExpenses = require('./postExpenses');
const { getPlan } = require('./plan');
const checkPlan = require('./middlewares/checkPlan');
const plan = require('./plan');
const selectCategories = require('./middlewares/selectCategories');
const { checkAddExpenses } = require('./middlewares/validateIncomeData');

const router = express.Router();

router.use(check);
router.route('/')
  .get(checkUnProtected, home.get);
router.route('/my-wallet')
  .get(checkMyWallet, MyWallet.get)
  .post(checkProtected, checkAddExpenses, postExpenses.post);

router.route('/my-wallet/plan/add-income')
  .get(plan.getBudget);

router.route('/my-wallet/plan/add-plan')
  .get(selectCategories, getPlan);

module.exports = router;
