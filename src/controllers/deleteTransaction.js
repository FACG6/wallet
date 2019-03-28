const deleteTrans = require('../database/queries/deleteTransaction');

module.exports = (req, res) => {
  deleteTrans.delete(req.body.id)
    .then(() => {
      res.send({ delete: true });
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal Server Error' });
    });
};
