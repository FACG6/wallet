const connection = require('../dbConnection');

module.exports = planId => connection.query('SELECT * from expense inner join category on category.id = expense.cat_id where expense.plan_id = $1 ORDER BY expense.id ASC', [planId]);
