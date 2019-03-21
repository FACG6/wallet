const express = require('express');

const { check } = require('./middlewares/authentication');
const { checkUnProtected } = require('./middlewares/check');
const home = require('../controllers/home');
const getMyWallet = require('./myWallet');
const { getPlan } = require('./plan');
const checkPlan = require('./middlewares/checkPlan');

const router = express.Router();

router.use(check);
router.route('/')
  .get(checkUnProtected, home.get);

router.route('/my-wallet')
  .get(getMyWallet.get);

router.route('/my-wallet/plan')
  .get(check, checkUnProtected, checkPlan, getPlan);

module.exports = router;
