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
  let orderId = body.resource_id || body.inserted_id
  if (orderId) {
    // GET order from API
    const url = '/orders/' + orderId + '.json'
    appSdk.apiRequest(storeId, url).then(({ response, auth }) => {
      let order = response.data
      const client = { appSdk, storeId, auth }

      // check trigger info to proceed with functions
      switch (body.method) {
        case 'POST':
          if (!body.subresource) {
            // new order
            // add order to respective customers
            Buyers.add(client, order)
            // end current request with success
            return respond(101)
          }
          break

        case 'PATCH':
          if (!body.subresource) {
            // order edited
            if (body.fields.indexOf('buyers')) {
              Buyers.add(client, order)
            }
            return respond(102)
          }
          break

        case 'PUT':
          if (!body.subresource) {
            // order reseted
            Buyers.remove(client, order).then(Buyers.add)
            return respond(103)
          }
          break
      }
      // unexpected
      respond(1)
    })

    .catch(err => {
      if (body.method === 'DELETE' && err.status === 404) {
        // order deleted
        let order = {
          _id: orderId
        }
        let { auth } = err
        Buyers.remove({ appSdk, storeId, auth }, order)
        // end current request with success
        respond(111)
      } else {
        errorResponse(err, respond)
      }
    })
  } else {
    // nothing to do
    respond(0)
  }
}

module.exports = {
  POST
}
