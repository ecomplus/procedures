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
    if (response && response.status >= 400 && response.status < 500) {
      if (response.status === 404) {
        let { data } = response
        if (data && data.error_code !== 20) {
          // resource ID not found ?
          // ignore
          return
        }
      }
      // debug unexpected response
      error.configJSON = {
        originalRequest: JSON.stringify(err.config),
        logRequest: JSON.stringify(config)
      }
      logger.error(error)
    }
  }
}
