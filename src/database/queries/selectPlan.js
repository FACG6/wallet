const connection = require('../dbConnection');

exports.select = (userID) => {
  const query = {
    text: `SELECT "plan".id As planId,
        "plan".starting, 
        "plan".ending, 
        "plan".income, 
        category.name,
        category.id AS categoryid, 
        category_plan.amount, 
        COALESCE(sum(expense.price),0) As totalExpCat, 
        COALESCE((sum(expense.price)*100/category_plan.amount),0) As percentage, 
        COALESCE((select sum(price) FROM expense WHERE plan_id = "plan".id),0) As totalExp,
        COALESCE((select sum(price) FROM expense WHERE plan_id = "plan".id)*100/"plan".income,0) As totalPercentage , 
        CASE 
        WHEN COALESCE((sum(expense.price)*100/category_plan.amount),0) > 70 THEN 'red'
        WHEN COALESCE((sum(expense.price)*100/category_plan.amount),0) > 50 THEN 'orange'
        ELSE 'green'
        END AS color ,
        CASE 
        WHEN COALESCE((select sum(price) FROM expense WHERE plan_id = "plan".id)*100/"plan".income,0) > 70 THEN 'red'
        WHEN COALESCE((select sum(price) FROM expense WHERE plan_id = "plan".id)*100/"plan".income,0) >50 THEN 'orange'
        ELSE 'green'
        END AS IncomeColor  
        from 
        "plan" FULL JOIN category_plan 
        ON category_plan.plan_id = "plan".id FULL JOIN category 
        ON category.id = category_plan.cat_id FULL JOIN expense 
        ON expense.cat_id = category.id 
        WHERE
         "plan".user_id = $1 and 
         "plan".id = (SELECT id FROM "plan" where user_id=$1 ORDER BY id DESC LIMIT 1) 
         GROUP BY
          "plan".id, "plan".income, category.name, category_plan.amount, category.id;`,
    values: [userID],
  };
  return connection.query(query);
};
