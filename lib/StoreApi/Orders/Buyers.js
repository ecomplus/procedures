'use strict'

// log on files
const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/StoreApi/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/StoreApi/ErrorHandling')

module.exports = {
  add (client, order) {
    getConfig(client).then(appConfig => {
      // add order to customers
      if (order.buyers && (!appConfig || appConfig.skip_new_order_buyers !== true)) {
        order.buyers.forEach(buyer => {
          let { appSdk, storeId, auth } = client
          logger.log(auth)
          // add order to customer
          // https://developers.e-com.plus/docs/api/#/store/customers/customers
          const url = '/customers/' + buyer._id + '/orders.json'
          const method = 'POST'
          const data = {
            _id: order._id
          }

          // send authenticated API request
          appSdk.apiRequest(storeId, url, method, data, auth).then(({ response }) => {
            // logger.log(response)
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
