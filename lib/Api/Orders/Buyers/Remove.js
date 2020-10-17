'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// MySQL database connection
const db = require(process.cwd() + '/lib/Database')

module.exports = ({ client, order, removeAll, appConfig }) => {
  return new Promise(resolve => {
    const end = () => resolve({ client, order, removeAll, appConfig })
    const fn = appConfig => {
      // remove order from older customers
      if ((removeAll || order.buyers) && appConfig.skip_remove_order_buyers !== true) {
        // logger.log(`> Remove buyers for #${order._id}`)
        const sql = 'SELECT customer_id FROM order_buyers WHERE order_id = ?'
        db.query(sql, [order._id], (err, rows) => {
          if (!err && rows) {
            // logger.log(rows)
            const { appSdk, storeId, auth } = client
            ;(async function loop () {
              for (let i = 0; i < rows.length; i++) {
                const row = rows[i]

                // not modified objects may not be removed
                if (!removeAll && !order.buyers.find(buyer => buyer._id === row.customer_id)) {
                  // skip current row
                  continue
                }

                // remove order from customer by ID
                // https://developers.e-com.plus/docs/api/#/store/customers/customers
                const url = '/customers/' + row.customer_id + '/orders/' + order._id + '.json'
                const method = 'DELETE'
                const data = null
                // logger.log(`${method} ${url}`)

                // send authenticated API request
                try {
                  await appSdk.apiRequest(storeId, url, method, data, auth)
                  // remove from database
                  const sql = 'DELETE FROM order_buyers WHERE order_id = ? AND customer_id = ? LIMIT 1'
                  db.query(sql, [order._id, row.customer_id])
                } catch (err) {
                  errorHandling(err)
                }
                // logger.log(`> #${order._id} removed ${row.customer_id}`)
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
