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
          let { storeId } = client
          ;(async function loop () {
            for (let i = 0; i < items.length; i++) {
              let item = items[i]

              await updateProduct(client, order, item, appConfig).then(() => {
                // insert into database
                let values = {
                  store_id: storeId,
                  order_id: order._id,
                  item_id: item._id,
                  product_id: item.product_id,
                  quantity: item.quantity,
                  price: item.price
                }
                if (item.variation_id) {
                  values.variation_id = item.variation_id
                }
                db.query('REPLACE INTO order_items SET ?', values)
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
          let sql = 'SELECT item_id, product_id, variation_id, quantity, price ' +
                    'FROM order_items WHERE order_id = ?'
          db.query(sql, [ order._id ], (err, rows) => {
            if (!err) {
              // send rows as items array
              run(rows)
            } else {
              end()
            }
          })
        } else {
          run(order.items)
        }
        break

      default:
        // status not changed
        run(order.items)
    }
  })
}
