const validator = require('validator');
const moment = require('moment');

const regex = /^\d{4}[/-]\d{1,2}[/-]\d{1,2}$/;

exports.validateBudget = (req, res, next) => {
  const { income, starting, ending } = req.body;
  if (!income || !starting || !ending) {
    return res.send({ state: 'ERR', reason: 'Empty' });
  }
  if (!validator.isFloat(income)) {
    return res.send({
      state: 'ERR',
      reason: 'Invalid',
      errMsg: 'Income value is invalid',
    });
  }
  /* Date can be in 'YYYY-MM-DD' Format or 'YYYY/MM/DD'. Other formats are not accepted!
     other written dates are not accepted */
  if (!regex.test(starting || !regex.test(ending))) {
    return res.send({
      state: 'ERR',
      reason: 'Invalid',
      errMsg: 'Date is invalid',
    });
  }
  // Date will be stored in Database in 'YYYY-MM-DD' format //
  const startDate = moment(new Date(starting)).format('YYYY-MM-DD');
  const endDate = moment(new Date(ending)).format('YYYY-MM-DD');
  if (!moment(endDate).isAfter(moment(startDate))) {
    return res.send({
      state: 'ERR',
      reason: 'Invalid',
      errMsg: 'From date should be greater than To date',
    });
  }
  if (!moment().isBetween(startDate, endDate)) {
    return res.send({ state: 'ERR', reason: 'Invalid', errMsg: 'To date should be greater than today' });
  }
  req.planData = {
    income,
    startDate,
    endDate,
  };
  next();
};

exports.validatePlan = (req, res, next) => {
  const { categories, budgets } = req.body;
  if (categories.length === 0 || budgets.length === 0) {
    return res.send({
      state: 'ERR',
      reason: 'Empty',
    });
  }
  if (categories.length !== budgets.length) {
    return res.send({
      state: 'ERR',
      reason: 'Invalid',
    });
  }
  const notValid = categories.some(category => !validator.isNumeric(category) || category <= 0);
  if (notValid) {
    return res.send({
      state: 'ERR',
      reason: 'Invalid',
    });
  }
  const amountValidity = budgets.some(amt => !validator.isFloat(amt) || amt <= 0);
  if (amountValidity) {
    return res.send({
      state: 'ERR',
      reason: 'Invalid',
    });
  }
  const total = budgets.reduce((accum, budget) => Number(accum) + Number(budget), 0);
  const { income } = req.session;
  if (total > income) {
    return res.send({
      state: 'ERR',
      reason: 'Exceeds Income',
    });
  }
  next();
};

exports.checkAddExpenses = (req, res, next) => {
  const {
    catId, price, date, description,
  } = req.body;

  const idCat = catId.trim();
  const priceExp = price.trim();
  const dateExp = date.trim();
  const descExp = description.trim();
  const toDate = new Date(dateExp);
  if (validator.isEmpty(idCat) || validator.isEmpty(priceExp) || validator.isEmpty(dateExp)) {
    res.send({ error: 'Please fill all fields' });
  } else if (!validator.isFloat(priceExp) || priceExp < 0.00 || !validator.isNumeric(idCat) || !(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateExp)) || description.search(/<[^>]*script/) !== -1) {
    res.send({ error: 'Please enter valid value' });
  } else if (!(toDate >= new Date(req.token.start) && toDate <= new Date(req.token.end))) {
    res.send({ error: `Please enter date between ${req.token.start} and ${req.token.end}` });
  } else if (req.token.categoriesId.indexOf(Number(idCat)) === -1) {
    res.send({ error: 'Sorry this category not in your budget' });
  } else {
    req.body.catId = idCat;
    req.body.price = priceExp;
    req.body.date = dateExp;
    req.body.description = descExp;
    next();
  }
};

exports.checkLogin = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  const emailTrim = email.trim();
  if (!password || !emailTrim) {
    res.send({ error: 'Please Fill All Field' });
  } else if (!(validator.isEmail(emailTrim))) {
    res.send({ error: 'Please Enter Valid Email' });
  } else {
    next();
  }
};
