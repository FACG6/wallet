const express = require('express');

const getMyWallet = require('./myWallet');

const router = express.Router();

router.route('/my-wallet')
  .get(getMyWallet.get);
module.exports = router;
