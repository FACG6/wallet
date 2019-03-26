const connection = require('../dbConnection');

module.exports = (userId, income, starting, ending) => connection.query('INSERT INTO "plan" (user_id, income, starting, ending) VALUES ($1, $2, $3, $4) RETURNING id', [userId, income, starting, ending]);
