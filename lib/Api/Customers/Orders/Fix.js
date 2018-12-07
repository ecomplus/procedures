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
          // read full customer body first
          const url = '/customers/' + customer._id + '.json'
          if (!fullCustomer) {
            const method = 'GET'
            const data = {}

            // send authenticated API request to GET full customer body
            await appSdk.apiRequest(storeId, url, method, data, auth).then(({ response }) => {
              // overwrite order object
              fullCustomer = response.data
            }).catch(errorHandling)
          }

          if (fullCustomer.orders && fullCustomer.orders.length) {
            // sum total customer orders values
            let totalValue = 0
            let totalSpent = 0
            let totalCancelled = 0

            for (let i = 0; i < fullCustomer.orders.length; i++) {
              let order = fullCustomer.orders[i]
              let value = order.amount.total
              totalValue += value

              // check current order status
              const url = '/orders/' + order._id + '.json'
              const method = 'GET'
              const data = {}
              const noAuth = true

              // send public API request
              await appSdk.apiRequest(storeId, url, method, data, auth, noAuth).then(({ response }) => {
                let statusObject = response.data.financial_status
                if (statusObject) {
                  /* pending · under_analysis · authorized · unauthorized ·
                  partially_paid · paid · in_dispute · partially_refunded ·
                  refunded · voided · unknown */
                  switch (statusObject.current) {
                    case 'paid':
                      totalSpent += value
                      break

                    case 'voided':
                    case 'refunded':
                      totalCancelled += value
                  }
                } else {
                  // no financial status
                  // treat main order status
                  switch (response.data.status) {
                    case 'closed':
                      // consider paid
                      totalSpent += value
                      break

                    case 'cancelled':
                      // consider voided
                      totalCancelled += value
                      break
                  }
                }
              }).catch(errorHandling)
            }

            // mount body to edit customer object
            const method = 'PATCH'
            const data = {
              orders_count: fullCustomer.orders.length,
              orders_total_value: totalValue,
              total_spent: totalSpent,
              total_cancelled: totalCancelled
            }

            // send authenticated API request to edit customer
            await appSdk.apiRequest(storeId, url, method, data, auth).catch(errorHandling)
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
