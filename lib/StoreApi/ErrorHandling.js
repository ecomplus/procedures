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
    logger.error(error)
    let { request, response } = error
    if (response && response.status >= 400 && response.status < 500) {
      // debug unexpected response
      let err = new Error('Unexpected response from Store API')
      err.request = JSON.stringify(request, null, 2)
      err.response = JSON.stringify(response, null, 2)
      logger.error(err)
    }
  }
}
