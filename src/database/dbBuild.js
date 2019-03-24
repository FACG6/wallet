const { readFileSync } = require('fs');
const { join } = require('path');

const dbConnection = require('./dbConnection');

let sql = '';
if (process.env.NODE_ENV === 'test') {
  sql = readFileSync(join(__dirname, 'fackData.sql')).toString();
} else {
  sql = readFileSync(join(__dirname, 'dbBuild.sql')).toString();
}


module.exports = () => dbConnection.query(sql);
