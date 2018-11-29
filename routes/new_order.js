'use strict'

// log on files
const logger = require('console-files')

const POST = (id, meta, body, respond, storeId, appSdk) => {
  // logger.log(body)
  let orderId = body.inserted_id
  if (orderId) {
    // GET order from API
    let url = '/orders/' + orderId + '.json'
    appSdk.apiRequest(storeId, url).then(order => {
      // read configured options from app hidden data
    })

    .catch(err => {
      if (err.response) {
        let statusCode = err.response.status
        if (statusCode >= 500 && statusCode < 600) {
          // return error code to receive webhook again further
          respond({}, null, statusCode, 'get_order_error_' + err.code, err.message)
        } else {
          // not found ?
          // ignore
          respond(err.message)
        }
      } else {
        logger.error(err)
        respond({}, null, 500, 'get_order_error', err.message)
      }
    })
  }

  respond({})
}

module.exports = {
  POST
}
