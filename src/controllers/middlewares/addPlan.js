const { sign } = require('jsonwebtoken');
const insertPlan = require('../../database/queries/insertPlan');
const insertCategoryPlan = require('../../database/queries/insertCategoryPlan');

exports.addPlan = (req, res, next) => {
  const { income, startDate, endDate } = req.session;
  const { id } = req.token;
  insertPlan(id, income, startDate, endDate)
    .then((plans) => {
      if (plans.rowCount === 1) {
        req.token.planId = plans.rows[0].id;
        next();
      } else {
        res.status(401).send({
          state: 'ERR',
          reason: 'server',
        });
      }
    })
    .catch(() => res.status(500).send({
      state: 'ERR',
      reason: 'server',
    }));
};

exports.addCategoryPlan = (req, res, next) => {
  const { categories, budgets } = req.body;
  const { planId } = req.token;
  insertCategoryPlan(planId, categories, budgets)
    .then(() => {
      next();
    })
    .catch(() => res.status(500).send({
      state: 'ERR',
      reason: 'server',
    }));
};
