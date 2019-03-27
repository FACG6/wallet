const connection = require('./../dbConnection');

exports.select = email => connection.query('select * from "user" where email=$1', [email]);
