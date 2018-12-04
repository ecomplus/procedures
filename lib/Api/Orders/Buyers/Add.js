'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// MySQL database connection
const db = require(process.cwd() + '/lib/Database')

module.exports = (client, order, appConfig) => {
  return new Promise(resolve => {
    const fn = appConfig => {
      // add order to buyers
      if (order.buyers && appConfig.skip_add_order_buyers !== true) {
        let { appSdk, storeId, auth } = client
        ;(async function loop () {
          for (let i = 0; i < order.buyers.length; i++) {
            let buyer = order.buyers[i]

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
          resolve(client, order, appConfig)
        }())
      }
    }

    // call function with app config object
    appConfig ? fn(appConfig) : getConfig(client).then(fn)
  })
}
