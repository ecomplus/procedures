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
const BuyersAdd = require(process.cwd() + '/lib/Api/Orders/Buyers/Add')
const BuyersRemove = require(process.cwd() + '/lib/Api/Orders/Buyers/Remove')
const ItemsAdd = require(process.cwd() + '/lib/Api/Orders/Items/Add')
const ItemsRemove = require(process.cwd() + '/lib/Api/Orders/Items/Remove')
const TransactionsAdd = require(process.cwd() + '/lib/Api/Orders/Transactions/Add')
const StatusFix = require(process.cwd() + '/lib/Api/Orders/Status/Fix')

const POST = (id, meta, trigger, respond, storeId, appSdk) => {
  const { object, objectId } = triggerParse(trigger)
  if (objectId) {
    // get authentication tokens
    appSdk.getAuth(storeId).then(auth => {
      const client = { appSdk, storeId, auth }
      const order = object
      // logger.log(order)
      let resCode = 1

      // check trigger action to proceed with functions
      let handleFix = true
      let promise
      switch (trigger.action) {
        case 'create':
          // new order or nested objects subresource
          // same handler
          // check for new order items and buyers
          promise = ItemsAdd({ client, order })
            .then(BuyersAdd)
            .then(TransactionsAdd)
          resCode = 101
          break

        case 'change':
          if (!trigger.subresource) {
            // order partially edited or entire reseted
            let removeAll = true
            promise = BuyersRemove({ client, order, removeAll })
              .then(BuyersAdd)
              .then(ItemsRemove)
              .then(ItemsAdd)
            resCode = 102
          } else {
            // check for specific order item partially edited
            // also check for status chages
            // ignore specific buyer edition if any (nothing to do)
            promise = ItemsRemove({ client, order })
              .then(ItemsAdd)
            resCode = 103
          }
          break

        case 'delete':
          if (!trigger.subresource) {
            // order removed
            let removeAll = true
            promise = BuyersRemove({ client, order, removeAll })
              .then(ItemsRemove)
            resCode = 105
            handleFix = false
          } else {
            // check for specific order item or buyer removed
            promise = BuyersRemove({ client, order })
              .then(ItemsRemove)
            resCode = 106
          }
          break
      }
      promiseHandler(promise, respond)

      if (handleFix) {
        // fix payment, shipping and order status if relevant changes were made
        promiseHandler(StatusFix({ client, order }), respond)
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
