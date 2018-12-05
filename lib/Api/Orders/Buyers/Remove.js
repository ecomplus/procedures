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
    const fn = appConfig => {
      // remove order from older customers
      if (appConfig.skip_remove_order_buyers !== true) {
        let sql = 'SELECT customer_id FROM order_buyers WHERE order_id = ?'
        db.query(sql, [ order._id ], (err, rows) => {
          if (!err) {
            let { appSdk, storeId, auth } = client
            ;(async function loop () {
              for (let i = 0; i < rows.length; i++) {
                let row = rows[i]

                // not modified objects may not be removed
                if (!removeAll) {
                  if (!order.buyers || !order.buyers.find(buyer => buyer._id === row.customer_id)) {
                    // skip current row
                    continue
                  }
                }

                // remove order from customer by ID
                // https://developers.e-com.plus/docs/api/#/store/customers/customers
                const url = '/customers/' + row.customer_id + '/orders.json'
                const method = 'DELETE'
                const data = null

                // send authenticated API request
                await appSdk.apiRequest(storeId, url, method, data, auth).then(() => {
                  // remove from database
                  let sql = 'DELETE FROM order_buyers WHERE order_id = ? AND customer_id = ? LIMIT 1'
                  db.query(sql, [ order._id, row.customer_id ])
                }).catch(errorHandling)
              }

              // all done
              // some delay for database operations
              setTimeout(() => {
                resolve(client, order, removeAll, appConfig)
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
