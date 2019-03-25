const validator = require('validator');

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
  } else if (!validator.isFloat(priceExp) || price < 0.00 || !validator.isNumeric(idCat) || !(/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(dateExp)) || description.search(/<[^>]*script/) !== -1) {
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
