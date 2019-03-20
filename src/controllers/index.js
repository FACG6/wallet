const express = require('express');

const { check } = require('./middlewares/authentication');
const { checkUnProtected } = require('./middlewares/check');
const home = require('../controllers/home');
const getMyWallet = require('./myWallet');

const router = express.Router();

router.use(check);
router.route('/')
  .get(checkUnProtected, home.get);

router.route('/my-wallet')
  .get(getMyWallet.get);

module.exports = router;
