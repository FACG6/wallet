const connection = require('../dbConnection');

module.exports = () => connection.query('SELECT * from category');
