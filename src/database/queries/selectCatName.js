const connection = require('../dbConnection');

module.exports = catId => connection.query('SELECT name from category where id = $1', [catId]);
