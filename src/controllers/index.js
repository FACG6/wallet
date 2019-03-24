const express = require('express');

const {
  check,
} = require('./middlewares/authentication');
const {
  checkUnProtected,
} = require('./middlewares/check');
const home = require('../controllers/home');
const getMyWallet = require('./myWallet');
const {
  checkMyWallet,
} = require('./middlewares/check');
const { getPlan } = require('./plan');
const checkPlan = require('./middlewares/checkPlan');
const plan = require('./plan');
const selectCategories = require('./middlewares/selectCategories');
const authentication = require('./middlewares/authentication');

const router = express.Router();

router.use(authentication.check);

router.use(check);
router.route('/')
  .get(checkUnProtected, home.get);
router.route('/my-wallet')
  .get(checkMyWallet, getMyWallet.get);

router.route('/my-wallet/plan/add-income')
  .get(plan.getBudget);

router.route('/my-wallet/plan/add-plan')
  .get(selectCategories, plan.getPlan);

module.exports = router;
