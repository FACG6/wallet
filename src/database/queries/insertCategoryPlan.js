const connection = require('../dbConnection');

module.exports = (planId, categories, amounts) => {
  return connection.query('Insert into category_plan(plan_id, cat_id, amount) select $1 as plan_id, unnest($2::numeric[]) as cat, unnest($3::numeric[]) as amount RETURNING plan_id', [planId, categories, amounts]);
}
