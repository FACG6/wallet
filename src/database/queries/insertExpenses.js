const connection = require('../dbConnection');

exports.insert = (planId, catId, price, date, description) => connection.query('insert into expense (plan_id, cat_id, price, date, description) values ($1, $2, $3, $4, $5) returning *', [planId, catId, price, date, description]);
