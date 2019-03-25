const { insert } = require('../database/queries/insertExpenses');

exports.post = (req, res) => {
  const {
    catId, price, date, description,
  } = req.body;
  insert(req.token.planId, catId, price, date, description)
    .then((result) => {
      res.send({ price: result.rows[0].price });
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal Server Error !' });
    });
};
