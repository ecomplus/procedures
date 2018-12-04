'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
// const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// MySQL database connection
const db = require(process.cwd() + '/lib/Database')
// common handlers
const updateProduct = require('./_UpdateProduct')

module.exports = (client, order, appConfig) => {
  return new Promise(resolve => {
    const fn = appConfig => {
      // increase order items stock quantity
      if (appConfig.skip_remove_order_items !== true) {
        let sql = 'SELECT product_id, variation_id, quantity, price ' +
                  'FROM order_items WHERE order_id = ?'
        db.query(sql, [ order._id ], (err, rows) => {
          if (!err) {
            ;(async function loop () {
              for (let i = 0; i < rows.length; i++) {
                let row = rows[i]

                // row as order item object
                // addingSale = false
                await updateProduct(client, order, row, appConfig, false).then(() => {
                  // remove from database
                  let sql = 'DELETE FROM order_items WHERE order_id = ? AND product_id = ? '
                  let params = [ order._id, row.product_id ]
                  if (row.variation_id) {
                    sql += 'AND variation_id = ? LIMIT 1'
                    params.push(row.variation_id)
                  } else {
                    sql += 'AND variation_id IS NULL LIMIT 1'
                  }
                  db.query(sql, params)
                })
              }

              // all done
              // some delay for database operations
              setTimeout(() => {
                resolve(client, order, appConfig)
              }, 100)
            }())
          }
        })
      }
    }

    // call function with app config object
    appConfig ? fn(appConfig) : getConfig(client).then(fn)
  })
}
