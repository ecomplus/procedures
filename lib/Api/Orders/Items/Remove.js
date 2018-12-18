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

module.exports = ({ client, order, removeAll, appConfig }) => {
  return new Promise(resolve => {
    const end = () => resolve({ client, order, removeAll, appConfig })
    const fn = appConfig => {
      // increase order items stock quantity
      // handle all items if order was cancelled
      const handleAll = (removeAll || order.status === 'cancelled')

      if ((handleAll || order.items) && appConfig.skip_remove_order_items !== true) {
        let sql = 'SELECT item_id, product_id, variation_id, quantity, price ' +
                  'FROM order_items WHERE order_id = ? AND quantity_removed < 1'
        db.query(sql, [ order._id ], (err, rows) => {
          if (!err) {
            ;(async function loop () {
              for (let i = 0; i < rows.length; i++) {
                let row = rows[i]

                // not modified objects may not be removed
                if (!handleAll && !order.items.find(item => item._id === row.item_id)) {
                  // skip current row
                  continue
                }

                // row as order item object
                // addingSale = false
                await updateProduct(client, order, row, appConfig, false).then(() => {
                  let sql
                  if (order.status !== 'cancelled') {
                    // remove from database
                    sql = 'DELETE FROM order_items WHERE order_id = ? AND product_id = ? '
                  } else {
                    // just mark table row as quantity not removed
                    sql = 'UPDATE order_items SET quantity_removed = 0 ' +
                          'WHERE order_id = ? AND product_id = ? '
                  }
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
              setTimeout(end, 100)
            }())
          } else {
            end()
          }
        })
      } else {
        end()
      }
    }

    // call function with app config object
    appConfig ? fn(appConfig) : getConfig(client).then(fn)
  })
}
