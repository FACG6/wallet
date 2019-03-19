const { readFileSync } = require('fs');
const { join } = require('path');
const dbConnection = require('./dbConnection');

const sql = readFileSync(join(__dirname, 'dbBuild.sql')).toString();

module.exports = () => dbConnection.query(sql);
