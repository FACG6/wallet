const connection = require('../dbConnection');

exports.delete = id => connection.query('delete from expense where id= $1', [id]);
