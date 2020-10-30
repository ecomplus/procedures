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
    const run = items => {
      const fn = appConfig => {
        // decrease order items stock quantity
        if (items && appConfig.skip_add_order_items !== true) {
          const { storeId } = client
          ;(async function loop () {
            for (let i = 0; i < items.length; i++) {
              const item = items[i]

              await updateProduct(client, order, item, appConfig).then(() => {
                // insert into database
                db.query('REPLACE INTO order_items SET ?', {
                  store_id: storeId,
                  order_id: order._id,
                  item_id: item._id,
                  product_id: item.product_id,
                  variation_id: item.variation_id || ''.padStart(24, ' '),
                  quantity: item.quantity,
                  quantity_decreased: 1,
                  price: item.price
                })
              })
            }

            // all done
            end()
          }())
        } else {
          end()
        }
      }

      // call function with app config object
      appConfig ? fn(appConfig) : getConfig(client).then(fn)
    }

    // treat order status if defined
    switch (order.status) {
      case 'cancelled':
        // skip if order is cancelled
        end()
        break

      case 'open':
      case 'closed':
        // order changed to open or closed
        // must fix all items
        if (!order.items) {
          const sql = 'SELECT item_id, product_id, variation_id, quantity, price ' +
                      'FROM order_items WHERE order_id = ? AND quantity_decreased < 1'
          db.query(sql, [order._id], (err, rows) => {
            if (!err) {
              // send rows as items array
              run(rows)
            } else {
              end()
            }
          })
        } else if (removeAll) {
          run(order.items)
        }
        break

      default:
        // status not changed
        if (removeAll) {
          run(order.items)
        }
    }
  })
}
