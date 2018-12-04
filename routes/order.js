'use strict'

// log on files
// const logger = require('console-files')
// treat error and respond
const errorResponse = require('./#error')()
// procedure functions
const Buyers = require('./../lib/Api/Orders/Buyers')

const POST = (id, meta, body, respond, storeId, appSdk) => {
  // treat trigger body
  // https://developers.e-com.plus/docs/api/#/store/triggers/triggers
  // logger.log(body)
  let orderId = body.inserted_id
  if (orderId) {
    // GET order from API
    const url = '/orders/' + orderId + '.json'
    appSdk.apiRequest(storeId, url).then(({ response, auth }) => {
      // https://developers.e-com.plus/docs/api/#/store/orders/orders
      let order = response.data
      // add order to respective customers
      Buyers.add({ appSdk, storeId, auth }, order)
      // end current request with success
      respond(null, null, 204)
    })

    .catch(err => {
      errorResponse(err, respond)
    })
  } else {
    // nothing to do
    respond(0)
  }
}

module.exports = {
  POST
}
