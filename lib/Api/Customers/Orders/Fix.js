'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// MySQL database connection
const db = require(process.cwd() + '/lib/Database')

module.exports = (client, customer, removeAll = false, appConfig, fullCustomer) => {
  return new Promise(resolve => {
    const end = () => resolve(client, customer, removeAll, appConfig, fullCustomer)
    const fn = appConfig => {
      // fix customer metrics with orders list
      if (customer.orders && appConfig.skip_fix_customer_orders !== true) {
        // some customer order edited, added or removed
        let { appSdk, storeId, auth } = client

        ;(async function delayed () {
          if (!fullCustomer) {
            // read full customer body first
            const url = '/customers/' + customer._id + '.json'
            const method = 'GET'
            const data = {}

            // send public API request
            await appSdk.apiRequest(storeId, url, method, data, auth).then(({ response }) => {
              // overwrite order object
              fullCustomer = response.data
            }).catch(errorHandling)
          }


        }())
      } else {
        end()
      }

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
          end()
        }())
      } else {
        end()
      }
    }

    // call function with app config object
    appConfig ? fn(appConfig) : getConfig(client).then(fn)
  })
}
