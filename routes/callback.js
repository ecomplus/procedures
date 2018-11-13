'use strict'

// log on files
const logger = require('console-files')

const POST = (id, meta, body, respond, storeId, authMethods) => {
  // Store API authentication callback
  authMethods.handleCallback(storeId, body).then(({ isNew, authenticationId }) => {
    // just respond first
    respond(null, null, 204)

    // handle successful authentication flux
    if (!isNew) {
      // not a new app installed
      // authentication done
      // create procedures if not already created
      let auth = authMethods.getAuth(storeId, authenticationId)
      authMethods.apiRequest(storeId, '/procedures.json', 'POST', {}, auth)
    }
  })

  .catch(err => {
    if (typeof err.code === 'string' && !err.code.startsWith('SQLITE_CONSTRAINT')) {
      // debug SQLite errors
      logger.error(err)
    }
    respond({}, null, 500, 'cpm_callback_error', err.message)
  })
}

module.exports = {
  POST
}
