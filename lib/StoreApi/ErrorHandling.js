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
    // debug app log error
    let error = err.appErrorLog
    let { response, config } = error
    if (response && response.status >= 400 && response.status < 500) {
      // debug unexpected response
      error.configJSON = {
        originalRequest: JSON.stringify(err.config),
        logRequest: JSON.stringify(config)
      }
      logger.error(error)
    }
  }
}
