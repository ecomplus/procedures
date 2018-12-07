'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// MySQL database connection
const db = require(process.cwd() + '/lib/Database')

module.exports = (client, order, removeAll = false, appConfig) => {
  return new Promise(resolve => {
    const end = () => resolve(client, order, removeAll, appConfig)
    const run = buyers => {
      const fn = appConfig => {
        // add order to buyers
        if (buyers && appConfig.skip_add_order_buyers !== true) {
          let { appSdk, storeId, auth } = client
          ;(async function loop () {
            for (let i = 0; i < buyers.length; i++) {
              let buyer = buyers[i]

              // add order to customer by ID
              // https://developers.e-com.plus/docs/api/#/store/customers/customers
              const url = '/customers/' + buyer._id + '/orders.json'
              const method = 'POST'
              const data = {
                _id: order._id
              }

              // send authenticated API request
              await appSdk.apiRequest(storeId, url, method, data, auth).then(() => {
                // insert into database
                let values = {
                  store_id: storeId,
                  order_id: order._id,
                  customer_id: buyer._id
                }
                db.query('REPLACE INTO order_buyers SET ?', values)
              }).catch(errorHandling)
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

    if (order.buyers) {
      run(order.buyers)
    } else {
      // treat order properties to update on customer if defined
      for (let field in order) {
        if (order.hasOwnProperty(field)) {
          switch (field) {
            case 'amount':
            case 'payment_method_label':
            case 'shipping_method_label':
            case 'number':
            case 'currency_id':
            case 'currency_symbol':
              // must fix all buyers
              let sql = 'SELECT customer_id AS _id FROM order_buyers WHERE order_id = ?'
              db.query(sql, [ order._id ], (err, rows) => {
                if (!err) {
                  // send rows as buyers array
                  run(rows)
                } else {
                  end()
                }
              })
              return
          }
        }
      }

      // nothing to update
      end()
    }
  })
}
