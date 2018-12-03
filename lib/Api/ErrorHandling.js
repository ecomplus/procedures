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
      if (status >= 400 && status < 500) {
        switch (status) {
          case 403:
            // ignore resource limits errors
            return
          case 404:
            if (data && data.error_code !== 20) {
              // resource ID not found ?
              // ignore
              return
            }
            break
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
}
