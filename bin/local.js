'use strict'

// log on files
const logger = require('console-files')
// handle app authentication to Store API
// https://github.com/ecomclub/ecomplus-app-sdk
const ecomAuth = require('ecomplus-app-sdk')

ecomAuth.promise.then(appSdk => {
  // configure setup for stores
  // list of procedures to save
  const procedures = require('./../lib/StoreAPi/Procedures')
  appSdk.configureSetup(procedures, ({ storeId }) => {
    logger.log('Setup store #' + storeId)
  })
})

.catch(err => {
  logger.error(err)
  // destroy Node process while Store API auth cannot be handled
  process.exit(1)
})
