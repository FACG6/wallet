const connection = require('../dbConnection');

module.exports = (planId, catId) => connection.query('SELECT cat_id, name, price, date, description from expense inner join category on category.id = expense.cat_id where plan_id = $1 and cat_id = $2 ORDER BY date ASC', [planId, catId]);
