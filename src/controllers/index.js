const express = require('express');

const {
  check,
} = require('./middlewares/authentication');
const {
  checkUnProtected,
  checkProtected,
  checkMyWallet,
  checkTransToken,
} = require('./middlewares/check');
const home = require('../controllers/home');
const MyWallet = require('./myWallet');
const postExpenses = require('./postExpenses');
const login = require('./login');
const {
  checkEmail,
} = require('./middlewares/checkEmail');
const {
  getSignUp,
  postSignUp,
} = require('./signUp');
const {
  checkEmailExist,
} = require('./middlewares/isUser');
const {
  hashPassword,
} = require('./middlewares/hashPassword');
const {
  addUser,
} = require('./middlewares/addUser');
const {
  compare,
} = require('./middlewares/comparePassword');
const selectCategories = require('./middlewares/selectCategories');
const {
  checkAddExpenses,
  checkLogin,
  validateBudget,
  validatePlan,
  checkEnterdData,
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
const {
  addPlan,
  addCategoryPlan,
} = require('./middlewares/addPlan');
const {
  getSpecificTransactions,
} = require('./middlewares/selectTransactions');
const {
  getTransactionsPage,
} = require('./transactions');
const selectAllTrans = require('./middlewares/selectAllTransactions');
const allTransactionsPage = require('./allTransactions');
const error = require('./error');
const deleteTransaction = require('./deleteTransaction');
const {
  getLogout,
} = require('./logout');

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

router.route('/my-wallet/plan/add-income')
  .get(isLogged, getBudget)
  .post(checkPlan, validateBudget, createSession, postIncome);

router.route('/my-wallet/plan/add-plan')
  .get(isLogged, selectCategories, getPlan)
  .post(checkPlan, checkSession, validatePlan, addPlan, addCategoryPlan, postPlan);

router.route('/my-wallet/transactions/:id')
  .get(checkProtected, checkTransToken, getSpecificTransactions, getTransactionsPage)
  .delete(checkProtected, deleteTransaction);
router.route('/my-wallet/all-transactions')
  .get(checkProtected, selectAllTrans, allTransactionsPage.get);


router.route('/logout')
  .get(checkProtected, getLogout);

router.use(error.client);
router.use(error.server);


module.exports = router;
