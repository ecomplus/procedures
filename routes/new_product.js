'use strict'

// log on files
// const logger = require('console-files')
// treat error and respond
const errorResponse = require('./#error')()

// procedure functions
const productQuantity = require('./../lib/StoreApi/Products/Quantity')

const POST = (id, meta, body, respond, storeId, appSdk) => {
  // logger.log(body)
  let productId = body.inserted_id
  if (productId) {
    // GET product from public API
    const url = '/products/' + productId + '.json'
    const method = 'GET'
    const data = {}
    const auth = null
    const noAuth = true

    appSdk.apiRequest(storeId, url, method, data, auth, noAuth).then(({ response, auth }) => {
      // https://developers.e-com.plus/docs/api/#/store/products/products
      let product = response.data
      // start handling product stock control
      productQuantity.setup({ appSdk, storeId, auth }, product)
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
