const express = require('express');

const {
  check,
} = require('./middlewares/authentication');
const {
  checkUnProtected,
} = require('./middlewares/check');
const home = require('../controllers/home');
const getMyWallet = require('./myWallet');
<<<<<<< HEAD
const authentication = require('./middlewares/authentication');
const {
  checkMyWallet,
} = require('./middlewares/check');
const { getPlan } = require('./plan');
const checkPlan = require('./middlewares/checkPlan');
=======
const plan = require('./plan');
const selectCategories = require('./middlewares/selectCategories');
const authentication = require('./middlewares/authentication');
const { checkMyWallet } = require('./middlewares/check');
>>>>>>> e616ecdc6cef81b684e766e60d2e3df4f13b12e6

const router = express.Router();

router.use(authentication.check);

router.use(check);
router.route('/')
  .get(checkUnProtected, home.get);
router.route('/my-wallet')
  .get(checkMyWallet, getMyWallet.get);
<<<<<<< HEAD
=======

router.route('/my-wallet/plan/add-income')
  .get(plan.getBudget);
>>>>>>> e616ecdc6cef81b684e766e60d2e3df4f13b12e6

router.route('/my-wallet/plan/add-plan')
  .get(selectCategories, plan.getPlan);

module.exports = router;
