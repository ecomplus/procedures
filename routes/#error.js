'use strict'

// log on files
const logger = require('console-files')

const errorResponse = () => {
  // label is the current parent filename without extension
  // eg.: new_order
  const label = module.parent.filename.split('/').pop().slice(0, -3)

  return (err, respond) => {
    // treat axios error
    let { code, message, response } = err
    if (response) {
      // response JSON data and status code
      let { data, status } = response

      if (status >= 500 && status < 600) {
        // return error code to receive webhook again further
        respond({}, null, status, label + '_' + code, message)
      } else if (status === 400 && data && data.error_code) {
        // request body error ?
        logger.error(err)
        respond({}, null, 501, label + '_' + code, message)
      } else {
        // not found ?
        // ignore
        respond(message)
      }
    } else if (err.appWithoutAuth) {
      respond({}, null, 503, label + '_without_auth', message)
    } else {
      logger.error(err)
      respond({}, null, 500, label + '_error', message)
    }
  }
}

module.exports = errorResponse
