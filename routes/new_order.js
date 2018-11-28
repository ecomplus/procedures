'use strict'

// log on files
const logger = require('console-files')

const POST = (id, meta, body, respond, storeId, appSdk) => {
  logger.log(body)
  respond({})
}

module.exports = {
  POST
}
