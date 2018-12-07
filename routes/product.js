'use strict'

// log on files
// const logger = require('console-files')
// treat error and respond
const errorResponse = require('./#error')()
// parse trigger body
const triggerParse = require(process.cwd() + '/lib/Api/TriggerParse')

// procedure functions
const HistoryFix = require(process.cwd() + '/lib/Api/Products/History/Fix')
const PriceFix = require(process.cwd() + '/lib/Api/Products/Price/Fix')
const QuantityFix = require(process.cwd() + '/lib/Api/Products/Quantity/Fix')

const POST = (id, meta, trigger, respond, storeId, appSdk) => {
  const { object, objectId } = triggerParse(trigger)
  if (objectId) {
    // get authentication tokens
    appSdk.getAuth(storeId).then(auth => {
      const client = { appSdk, storeId, auth }
      let promise = QuantityFix(client, object).then(PriceFix)
      if (trigger.subresource) {
        // alse handle history records fix
        promise.then(HistoryFix)
      }

      // end current request with success
      respond(301)
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
