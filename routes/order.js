'use strict'

const label = 'order'
// log on files
// const logger = require('console-files')
// treat error and respond
const errorResponse = require('./#error')(label)
// treat promises
const promiseHandler = require('./#promise')(label)
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
      let addAll
      // logger.log(order)
      let resCode = 1

      // check trigger action to proceed with functions
      let handleFix = false
      let promise
      const promisesCount = { n: 0 }
      const proceed = (payload, nextPromise) => {
        promisesCount.n++
        return nextPromise(payload)
      }

      switch (trigger.action) {
        case 'create':
          // new order or nested objects subresource
          // same handler
          // check for new order items, buyers and transactions
          handleFix = addAll = !trigger.subresource
          promise = BuyersAdd({ client, order, addAll })
            .then(p => proceed(p, TransactionsAdd))
          resCode = 101
          break

        case 'change':
          if (!trigger.subresource) {
            // order partially edited or entire reseted
            handleFix = true
            if (trigger.method === 'PATCH') {
              resCode = 102
            } else {
              resCode = 103
            }
            promise = BuyersRemove({ client, order })
              .then(p => proceed(p, BuyersAdd))
              .then(p => proceed(p, ItemsRemove))
              .then(p => proceed(p, ItemsAdd))
          } else {
            // check for specific order item partially edited
            // also check for status chages
            // ignore specific buyer edition if any (nothing to do)
            promise = ItemsRemove({ client, order })
              .then(p => proceed(p, ItemsAdd))
            resCode = 104
          }
          break

        case 'delete':
          if (!trigger.subresource) {
            // order removed
            const removeAll = true
            promise = BuyersRemove({ client, order, removeAll })
              .then(p => proceed(p, ItemsRemove))
            resCode = 105
            handleFix = false
          } else {
            // check for specific order item or buyer removed
            promise = BuyersRemove({ client, order })
              .then(p => proceed(p, ItemsRemove))
            resCode = 106
          }
          break
      }

      const debugPayload = { resCode, promisesCount, storeId, order }
      promiseHandler(promise, respond, debugPayload)

      if (handleFix) {
        // fix payment, shipping and order status if relevant changes were made
        promiseHandler(StatusFix({ client, order }), respond, debugPayload)
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
