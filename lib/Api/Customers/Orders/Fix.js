'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')

module.exports = ({ client, customer, removeAll, appConfig, fullCustomer }) => {
  return new Promise(resolve => {
    const end = () => resolve({ client, customer, removeAll, appConfig, fullCustomer })
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

            // handle up to 100 order per time
            let ordersNum = 100
            for (let i = 0; i < Math.ceil(fullCustomer.orders.length / ordersNum); i++) {
              let orders = fullCustomer.orders.slice(i * ordersNum, i * ordersNum + ordersNum)
              // mount URL to list customer orders from API
              // check current status of each order
              let url = '/orders.json?fields=amount,financial_status,status&_id='
              const method = 'GET'
              const data = {}
              orders.forEach(order => {
                totalValue += order.amount.total
                url += order._id + ','
              })

              // send authenticated API request
              // logger.log(url)
              await appSdk.apiRequest(storeId, url, method, data, auth).then(({ response }) => {
                response.data.result.forEach(order => {
                  let value = order.amount.total
                  let statusObject = order.financial_status
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
                    switch (order.status) {
                      case 'closed':
                        // consider paid
                        totalSpent += value
                        break

                      case 'cancelled':
                        // consider voided
                        totalCancelled += value
                    }
                  }
                })
              }).catch(errorHandling)
            }

            // mount body to edit customer object
            const method = 'PATCH'
            // round values for up to 0.00001 precision
            let round = value => Math.round(value * 100000) / 100000
            const data = {
              orders_count: fullCustomer.orders.length,
              orders_total_value: round(totalValue),
              total_spent: round(totalSpent),
              total_cancelled: round(totalCancelled)
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
