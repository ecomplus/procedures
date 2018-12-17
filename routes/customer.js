'use strict'

// log on files
// const logger = require('console-files')
// treat error and respond
const errorResponse = require('./#error')()
// treat promises
const promiseHandler = require('./#promise')()
// parse trigger body
const triggerParse = require(process.cwd() + '/lib/Api/TriggerParse')

// procedure functions
const OrdersFix = require(process.cwd() + '/lib/Api/Customers/Orders/Fix')

const POST = (id, meta, trigger, respond, storeId, appSdk) => {
  const { object, objectId } = triggerParse(trigger)
  if (objectId) {
    // get authentication tokens
    appSdk.getAuth(storeId).then(auth => {
      const client = { appSdk, storeId, auth }
      const customer = object
      // logger.log(customer)
      let promise = OrdersFix({ client, customer })
      promiseHandler(promise, respond)

      // end current request with success
      respond(201)
    }).catch(err => {
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
