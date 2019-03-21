const express = require('express');

const {
  check,
} = require('./middlewares/authentication');
const {
  checkUnProtected,
} = require('./middlewares/check');
const home = require('../controllers/home');
const getMyWallet = require('./myWallet');
const authentication = require('./middlewares/authentication');
const {
  checkMyWallet,
} = require('./middlewares/check');

const router = express.Router();

router.use(authentication.check);

router.use(check);
router.route('/')
  .get(checkUnProtected, home.get);
router.route('/my-wallet')
  .get(checkMyWallet, getMyWallet.get);

module.exports = router;
