const connection = require('../dbConnection');

exports.checkEmail = email => connection.query('select email from "user" where email=$1', [email]);
