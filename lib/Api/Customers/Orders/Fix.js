'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')

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

            // send authenticated API request to GET full customer body
            await appSdk.apiRequest(storeId, url, method, data, auth).then(({ response }) => {
              // overwrite order object
              fullCustomer = response.data
            }).catch(errorHandling)
          }

          if (fullCustomer.orders && fullCustomer.orders.length) {
            // mount body to edit customer object
            // https://developers.e-com.plus/docs/api/#/store/customers/
            const method = 'PATCH'
            const data = {
              orders_count: fullCustomer.orders.length,
              orders_total_value: 0,
              total_spent: 0,
              total_cancelled: 0
            }

            fullCustomer.orders.forEach(({ amount }) => {
              let value = amount.total
              data.orders_total_value += value
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
  })
}
