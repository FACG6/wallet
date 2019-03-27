const connection = require('./../dbConnection');

module.exports = (category, user, plan) => connection.query('select expense.date , expense.price , expense.description , category.name from expense inner join  category on expense.id = category.id inner join "plan" on expense.plan_id = "plan".id  inner join "user" on "user".id = "plan".user_id  where  category.id=$1 AND  "user".id =$2 AND "plan".id = $3 ', [category, user, plan]);
