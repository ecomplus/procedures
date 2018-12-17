'use strict'

// log on files
const logger = require('console-files')

const promiseHandler = () => {
  // label is the current parent filename without extension
  // eg.: new_order
  const label = module.parent.filename.split('/').pop().slice(0, -3)

  return (promise, respond) => {
    // watch promise with timeout
    let timer = setTimeout(() => {
      let msg = 'Promise not done after 3 minutes on route ' + label
      let err = new Error(msg)
      logger.error(err)
    }, 180000)

    promise.then(() => {
      logger.log('timer ' + label)
      logger.log(timer)
      clearTimeout(timer)
    }).catch(err => {
      // unexpected promise error here
      logger.error(err)
      respond({}, null, 500, label + '_promise_error')
    })
  }
}

module.exports = promiseHandler
