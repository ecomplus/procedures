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
const StatusFix = require(process.cwd() + '/lib/Api/Orders/Status/Fix')

const POST = (id, meta, trigger, respond, storeId, appSdk) => {
  const { object, objectId } = triggerParse(trigger)
  if (objectId) {
    // get authentication tokens
    appSdk.getAuth(storeId).then(auth => {
      const client = { appSdk, storeId, auth }
      let resCode = 1

      // check trigger method to proceed with functions
      let handleFix = true
      switch (trigger.method) {
        case 'POST':
          // new order or nested objects subresource
          // same handler
          // check for new order items and buyers
          ItemsAdd(client, object)
            .then(BuyersAdd)
          resCode = 101
          break

        case 'PATCH':
          if (!trigger.subresource) {
            // order partially edited
            BuyersRemove(client, object)
              .then(BuyersAdd)
              .then(ItemsRemove)
              .then(ItemsAdd)
            resCode = 102
          } else {
            // check for specific order item partially edited
            // also check for status chages
            // ignore specific buyer edition if any (nothing to do)
            ItemsRemove(client, object)
              .then(ItemsAdd)
            resCode = 103
          }
          break

        case 'PUT':
          if (!trigger.subresource) {
            // entire order reseted
            // removeAll = true
            BuyersRemove(client, object, true)
              .then(BuyersAdd)
              .then(ItemsRemove)
              .then(ItemsAdd)
            resCode = 104
          }
          break

        case 'DELETE':
          if (!trigger.subresource) {
            // order removed
            // removeAll = true
            BuyersRemove(client, object, true)
              .then(ItemsRemove)
            resCode = 105
            handleFix = false
          } else {
            // check for specific order item or buyer removed
            BuyersRemove(client, object)
              .then(ItemsRemove)
            resCode = 106
          }
          break
      }

      if (handleFix) {
        // fix payment, shipping and order status if relevant changes were made
        StatusFix(client, object)
      }

      // end current request with success
      respond(resCode)
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
