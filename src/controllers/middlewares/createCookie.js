const { sign } = require('jsonwebtoken');

exports.createCookie = payload => sign(payload, process.env.SECRET);
