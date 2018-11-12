'use strict'

// log on files
const logger = require('console-files')

const POST = (id, meta, body, respond, storeId, { handleCallback }) => {
  // Store API authentication callback
  handleCallback(storeId, body).catch(err => {
    logger.error(err)
    respond({}, null, 500, 'cpm_callback_error', err.message)
  })

  // handle successful authentication flux
  .then(({ isNew }) => {
    // just respond first
    respond(null, null, 204)
    if (!isNew) {
      // not a new app installed
      // authentication done
      // create procedures if not already created
    }
  })
}

module.exports = {
  POST
}
