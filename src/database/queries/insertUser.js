const connection = require('../dbConnection');

exports.insert = (username, password, email) => connection.query('INSERT INTO "user" (username,password,email) VALUES ($1, $2, $3) returning *', [username, password, email]);
