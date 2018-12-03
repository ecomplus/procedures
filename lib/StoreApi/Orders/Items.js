'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/StoreApi/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/StoreApi/ErrorHandling')

module.exports = {
  add (client, order) {
    getConfig(client).then(appConfig => {
      // decrease order items stock quantity
      if (order.items && (!appConfig || appConfig.skip_new_order_items !== true)) {
        let { appSdk, storeId, auth } = client
        order.items.forEach(item => {
          // read product first
          const url = '/products/' + item._id + '.json'
          const method = 'GET'
          const data = {}
          const noAuth = true

          // send public API request
          appSdk.apiRequest(storeId, url, method, data, auth, noAuth).then(({ response }) => {
            // add product inventory change record
            // https://developers.e-com.plus/docs/api/#/store/products/products
            const url = '/products/' + item._id + '/inventory_records.json'
            const method = 'POST'
            const data = {
              date_of_change: order.created_at,
              origin: 'Order ' + order._id,
              quantity: item.quantity
            }

            // send authenticated API request
            appSdk.apiRequest(storeId, url, method, data, auth).then(({ response }) => {
              // logger.log(response)
            }).catch(errorHandling)
          }).catch(errorHandling)
        })
      }
    })
  },

  remove (client, order) {
    getConfig(client).then(appConfig => {
      // remove order from older customers
    })
  }
}
