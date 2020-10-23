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
      const isCancelled = order.status === 'cancelled'
      const handleAll = (removeAll || isCancelled)

      if ((handleAll || order.items) && appConfig.skip_remove_order_items !== true) {
        const sql = 'SELECT item_id, product_id, variation_id, quantity, price ' +
                  'FROM order_items WHERE order_id = ? AND quantity_decreased >= 1'
        db.query(sql, [order._id], (err, rows) => {
          if (!err) {
            ;(async function loop () {
              for (let i = 0; i < rows.length; i++) {
                const row = rows[i]

                // not modified objects may not be removed
                let item
                if (Array.isArray(order.items)) {
                  item = order.items.find(item => item._id === row.item_id)
                }
                if (
                  (!handleAll && !item) ||
                  (!isCancelled && item && item.quantity === row.quantity)
                ) {
                  // skip current row
                  continue
                }

                // row as order item object
                // addingSale = false
                // logger.log(`> Clear product #${row.product_id} for #${order._id}`)
                await updateProduct(client, order, row, appConfig, false).then(() => {
                  let sql = order.status !== 'cancelled'
                    // remove from database
                    ? 'DELETE FROM order_items'
                    // just mark table row as quantity not removed
                    : 'UPDATE order_items SET quantity_decreased = 0'
                  sql += ' WHERE order_id = ? AND product_id = ? AND variation_id = ? LIMIT 1'
                  db.query(sql, [
                    order._id,
                    row.product_id,
                    (row.variation_id || ''.padStart(24, ' '))
                  ])
                })
                // logger.log(`> Clear product #${row.product_id} done for #${order._id}`)
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
