'use strict'

// SQLite3 client
// https://github.com/mapbox/node-sqlite3
const sqlite = require('sqlite3').verbose()

// setup database
const db = new sqlite.Database(process.env.DB_FILENAME, err => {
  if (err) {
    throw err
  } else {
    // create tables
    db.run(`CREATE TABLE IF NOT EXISTS stock_control (
      updated_at           DATETIME  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
      store_id             INTEGER   NOT NULL,
      product_id           VARCHAR   NOT NULL  PRIMARY KEY,
      variation_id         VARCHAR   NULL      PRIMARY KEY,
      last_read_quantity   INTEGER   NOT NULL  DEFAULT 0,
      last_read_record     VARCHAR   NULL
    );`)
  }
})

module.exports = db
