'use strict'

// log on files
const logger = require('console-files')

const promiseHandler = label => {
  return (promise, respond, payload) => {
    // watch promise with timeout
    const timer = setTimeout(() => {
      const msg = 'Promise not done after 3 minutes on route ' + label
      const err = new Error(msg)
      if (payload) {
        err.payload = JSON.stringify(payload)
      }
      logger.error(err)
    }, 180000)

    promise.then(() => {
      clearTimeout(timer)
    }).catch(err => {
      // unexpected promise error here
      logger.error(err)
      respond({}, null, 500, label + '_promise_error')
    })
  }
}

module.exports = promiseHandler
