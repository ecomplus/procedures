'use strict'

// log on files
const logger = require('console-files')

const promiseHandler = label => {
  return (promise, respond, payload) => {
    // watch promise with timeout
    const timer = setTimeout(() => {
      const msg = 'Promise not done after 5 minutes on route ' + label
      const err = new Error(msg)
      err.time = new Date().toISOString()
      if (payload) {
        err.payload = JSON.stringify(payload)
      }
      logger.error(err)

      // still debugging promise end
      promise.then(() => {
        const err = new Error('Promise resolved after timeout')
        err.time = new Date().toISOString()
        logger.error(err)
      })
    }, 300000)

    promise.then(() => {
      clearTimeout(timer)
    }).catch(err => {
      clearTimeout(timer)
      // unexpected promise error here
      logger.error(err)
      respond({}, null, 500, label + '_promise_error')
    })
  }
}

module.exports = promiseHandler
