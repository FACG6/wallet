require('dotenv').config();
const { Pool } = require('pg');
const url = require('url');

let dbUrl = process.env.DB_LOCAL_URL;
if (process.env.NODE_ENV === 'pro') {
  dbUrl = process.env.DB_HEROKU_URL;
}
if (process.env.NODE_ENV === 'test') {
  dbUrl = process.env.DB_TESTING_URL;
}
else {
  dbUrl = process.env.DB_LOCAL_URL;
}

const urlParams = url.parse(dbUrl);
const [username, password] = urlParams.auth.split(':');

const options = {
  user: username,
  password,
  database: urlParams.pathname.split('/')[1],
  host: urlParams.hostname,
  port: urlParams.port,
  ssl: !(urlParams.hostname === 'localhost'),
};

module.exports = Pool(options);
