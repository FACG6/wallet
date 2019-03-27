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
const displayTransaction = require('./middlewares/selectTransactions');
const login = require('./login');
const { checkEmail } = require('./middlewares/checkEmail');
const transactions = require('./transactions');
const { getSignUp, postSignUp } = require('./signUp');
const { checkEmailExist } = require('./middlewares/isUser');
const { hashPassword } = require('./middlewares/hashPassword');
const { addUser } = require('./middlewares/addUser');
const { getLogout } = require('./logout');
const { compare } = require('./middlewares/comparePassword');
const selectCategories = require('./middlewares/selectCategories');
const {
  checkAddExpenses, checkLogin, validateBudget, validatePlan, checkEnterdData,
} = require('./middlewares/validateIncomeData');
const {
  getPlan,
  getBudget,
  postPlan,
  postIncome,
} = require('./plan');
const {
  isLogged,
  checkPlan,
  createSession,
  checkSession,
} = require('./middlewares/checkPlan');
const { addPlan, addCategoryPlan } = require('./middlewares/addPlan');

const router = express.Router();

router.use(check);

router.route('/')
  .get(checkUnProtected, home.get);

router.route('/sign-up')
  .get(checkUnProtected, getSignUp)
  .post(checkUnProtected, checkEnterdData, checkEmailExist, hashPassword, addUser, postSignUp);

router.route('/my-wallet')
  .get(checkMyWallet, MyWallet.get)
  .post(checkProtected, checkAddExpenses, postExpenses.post);
router.route('/login')
  .get(checkUnProtected, login.get)
  .post(checkUnProtected, checkLogin, checkEmail, compare, login.post);
router.route('/transactions')
  .get(displayTransaction.show, transactions.get);
router.use('/my-wallet/transactions/:category', (req, res) => {
  res.send(req.params); // fortesting
});

router.route('/login')
  .get(checkUnProtected, login.get)
  .post(checkUnProtected, checkLogin, checkEmail, compare, login.post);

router.route('/transactions')
  .get(displayTransaction.show, transactions.get);

router.use('/my-wallet/transactions/:category', (req, res) => {
  res.send(req.params); // fortesting
});

router.route('/my-wallet/plan/add-income')
  .get(isLogged, getBudget)
  .post(checkPlan, validateBudget, createSession, postIncome);

router.route('/my-wallet/plan/add-plan')
  .get(isLogged, selectCategories, getPlan)
  .post(checkPlan, checkSession, validatePlan, addPlan, addCategoryPlan, postPlan);

router.route('/logout')
  .get(checkProtected, getLogout);

module.exports = router;
