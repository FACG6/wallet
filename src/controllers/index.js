const express = require('express');

const { check } = require('./middlewares/authentication');
const {
  checkUnProtected,
  checkProtected,
  checkMyWallet,
} = require('./middlewares/check');
const home = require('../controllers/home');
const MyWallet = require('./myWallet');
const postExpenses = require('./postExpenses');
const {
  getPlan,
  getBudget,
  postPlan,
  postIncome,
} = require('./plan');
const { validateBudget, validatePlan, checkAddExpenses } = require('./middlewares/validateIncomeData');
const {
  isLogged,
  checkPlan,
  createSession,
  checkSession,
} = require('./middlewares/checkPlan');
const selectCategories = require('./middlewares/selectCategories');
const { addPlan, addCategoryPlan } = require('./middlewares/addPlan');

const router = express.Router();

router.use(check);
router.route('/')
  .get(checkUnProtected, home.get);
router.route('/my-wallet')
  .get(checkMyWallet, MyWallet.get)
  .post(checkProtected, checkAddExpenses, postExpenses.post);

router.route('/my-wallet/plan/add-income')
  .get(isLogged, getBudget)
  .post(checkPlan, validateBudget, createSession, postIncome);

router.route('/my-wallet/plan/add-plan')
  .get(isLogged, selectCategories, getPlan)
  .post(checkPlan, checkSession, validatePlan, addPlan, addCategoryPlan, postPlan);

module.exports = router;
