'use strict'

// log on files
// const logger = require('console-files')
// treat error and respond
const errorResponse = require('./#error')()
// parse trigger body
const triggerParse = require(process.cwd() + '/lib/Api/TriggerParse')

// procedure functions
const BuyersAdd = require(process.cwd() + '/lib/Api/Orders/Buyers/Add')
const BuyersRemove = require(process.cwd() + '/lib/Api/Orders/Buyers/Remove')
const ItemsAdd = require(process.cwd() + '/lib/Api/Orders/Items/Add')
const ItemsRemove = require(process.cwd() + '/lib/Api/Orders/Items/Remove')

const POST = (id, meta, trigger, respond, storeId, appSdk) => {
  const { object, objectId } = triggerParse(trigger)
  if (objectId) {
    // get authentication tokens
    appSdk.getAuth(storeId).then(auth => {
      const client = { appSdk, storeId, auth }
      let resCode = 1

      // check trigger method to proceed with functions
      switch (trigger.method) {
        case 'POST':
          // new order
          ItemsAdd(client, object)
            .then(BuyersAdd)
          resCode = 101
          break

        case 'PATCH':
          // order partially edited
          BuyersRemove(client, object)
            .then(BuyersAdd)
            .then(ItemsRemove)
            .then(ItemsAdd)
          resCode = 102
          break

        case 'PUT':
          // entire order reseted
          // removeAll = true
          BuyersRemove(client, object, true)
            .then(BuyersAdd)
            .then(ItemsRemove)
            .then(ItemsAdd)
          resCode = 103
          break

        case 'DELETE':
          // order removed
          // removeAll = true
          BuyersRemove(client, object, true)
            .then(ItemsRemove)
          resCode = 104
          break
      }
      // end current request with success
      respond(resCode)
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
