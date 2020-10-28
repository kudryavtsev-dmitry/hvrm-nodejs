const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hvrm',
  password: '357753',
  port: 5432,
})

module.exports = pool
