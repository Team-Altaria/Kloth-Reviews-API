const Pool = require("pg").Pool;

const pool = new Pool({
  user: "root",
  password: 'root',
  database: "FEC",
  host: "localhost"
});

module.exports = pool;