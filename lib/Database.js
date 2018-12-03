'use strict'

// log on files
const logger = require('console-files')

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

module.exports = {
  ...pool,

  // custom function before query
  query: (sql, values, callback) => {
    if (typeof values === 'function') {
      callback = values
      values = null
    }
    return pool.query(sql, values, (err, results, fields) => {
      // debug any Database error before callback
      if (err) {
        logger.error(err)
      }
      if (typeof callback === 'function') {
        callback(err, results, fields)
      }
    })
  }
}
