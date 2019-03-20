const express = require('express');

const getMyWallet = require('./myWallet');
const authentication = require('./middlewares/authentication');
const { checkMyWallet } = require('./middlewares/check');

const router = express.Router();

router.use(authentication.check);
router.route('/my-wallet')
  .get(checkMyWallet, getMyWallet.get);
module.exports = router;
