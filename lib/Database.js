'use strict'

// log on files
// const logger = require('console-files')

// MySQL client
const mysql = require('mysql')
// connection pooling
// https://github.com/mysqljs/mysql#pooling-connections
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // solve problem with BIGINT and JS Number.MAX_SAFE_INTEGER
  supportBigNumbers: true,
  bigNumberStrings: true
})

module.exports = pool
