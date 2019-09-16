const monk = require('monk');

const db = monk('localhost/job-tracker');

module.exports = db;