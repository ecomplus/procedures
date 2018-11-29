'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/StoreApi/AppConfig')

module.exports = {
  add (client, order) {
    getConfig(client).then(appConfig => {
      // add order to customers
      if (order.buyers && (!appConfig || appConfig.skip_new_order_buyers !== false)) {
        order.buyers.forEach(buyer => {
          let { appSdk, storeId, auth } = client
          // add order to customer
          // https://developers.e-com.plus/docs/api/#/store/customers/customers
          let url = '/customers/' + buyer._id + '/orders.json'
          let method = 'POST'
          let data = {
            _id: order._id
          }
          appSdk.apiRequest(storeId, url, method, data, auth)
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
