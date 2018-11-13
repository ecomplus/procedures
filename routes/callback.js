'use strict'

// log on files
const logger = require('console-files')

const POST = (id, meta, body, respond, storeId, apiMethods) => {
  // Store API authentication callback
  apiMethods.handleCallback(storeId, body).catch(err => {
    if (typeof err.code === 'string' && !err.code.startsWith('SQLITE_CONSTRAINT')) {
      // debug SQLite errors
      logger.error(err)
    }
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
      let auth = apiMethods.getAuth(storeId, body.my_id)
      apiMethods.apiRequest(storeId, '/procedures.json', 'POST', {}, auth)
    }
  })
}

module.exports = {
  POST
}
