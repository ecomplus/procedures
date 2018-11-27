'use strict'

// log on files
const logger = require('console-files')
// handle app authentication to Store API
// https://github.com/ecomclub/ecomplus-app-sdk
const apiAuth = require('ecomplus-app-sdk').promise

apiAuth.catch(err => {
  logger.error(err)
  // destroy Node process while Store API auth cannot be handled
  process.exit(1)
})
