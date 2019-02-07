'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// common handlers
const newRecord = require('./_NewRecord')
const orderMainStatus = require('./_OrderMainStatus')

module.exports = ({ client, order, removeAll, appConfig }) => {
  return new Promise(resolve => {
    const end = () => resolve({ client, order, removeAll, appConfig })
    const fn = appConfig => {
      // fix order financial or fulfilment status when fulfillments or payments history is added
      // https://developers.e-com.plus/docs/api/#/store/orders/orders
      let fieldStatus, fieldRecords, fieldSubresource
      if (!order.status) {
        if (order.payments_history && appConfig.disable_fix_payment_status !== true) {
          fieldSubresource = 'transactions'
          fieldStatus = 'financial_status'
          fieldRecords = 'payments_history'
        } else if (order.fulfillments && appConfig.disable_fix_shipping_status !== true) {
          fieldSubresource = 'shipping_lines'
          fieldStatus = 'fulfillment_status'
          fieldRecords = 'fulfillments'
        }
      }
      // logger.log(order)

      if (fieldStatus) {
        // handle new status record
        newRecord(client, order, fieldStatus, fieldRecords, fieldSubresource)
      } else if (order.fulfillment_status || order.financial_status) {
        if (appConfig.disable_fix_order_status !== true) {
          let { appSdk, storeId, auth } = client

          // fix order main status
          ;(async function delayed () {
            const url = '/orders/' + order._id + '.json'
            let orderBody
            if (order.fulfillment_status && order.financial_status) {
              orderBody = order
            } else {
              // try to handle both status
              // get current order status first
              const method = 'GET'
              const data = {}
              const noAuth = true

              // send public API request
              await appSdk.apiRequest(storeId, url, method, data, auth, noAuth).then(({ response }) => {
                // overwrite order body object
                orderBody = response.data
              }).catch(errorHandling)
            }

            const status = orderMainStatus(orderBody)
            if (orderBody.status !== status) {
              // mount body to edit order object
              const method = 'PATCH'
              const data = { status }
              // send authenticated API request to edit order
              await appSdk.apiRequest(storeId, url, method, data, auth).catch(errorHandling)
            }

            // all done
            end()
          }())
          return
        }
      }

      // end promise without waiting full async process
      end()
    }

    // call function with app config object
    appConfig ? fn(appConfig) : getConfig(client).then(fn)
  })
}
