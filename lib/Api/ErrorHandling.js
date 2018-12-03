'use strict'

// log on files
const logger = require('console-files')

module.exports = err => {
  // axios error object
  // https://github.com/axios/axios#handling-errors
  if (!err.appAuthRemoved && !err.appErrorLog) {
    // error not treated by App SDK
    logger.error(err)
  } else if (err.appErrorLog && !err.appErrorLogged) {
    // cannot log to app hidden data
    // debug app log error
    let error = err.appErrorLog
    let { response, config } = error

    // check response status code
    if (response) {
      let { status, data } = response
      // ignore resource ID not found and resource limits errors
      if (status >= 400 && status !== 403 && status < 500 && (!data || data.error_code !== 20)) {
        // debug unexpected response
        error.configJSON = {
          originalRequest: JSON.stringify(err.config),
          logRequest: JSON.stringify(config)
        }
        logger.error(error)
      }
    }
  }
}
