'use strict'

// log on files
// const logger = require('console-files')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// common handlers
const orderMainStatus = require('./_OrderMainStatus')
const getLastRecord = require('./_GetLastRecord')

const currentStatus = (statusRecord, subresourceId, subresourceList) => {
  // returns current shipping or payment status string
  let current = statusRecord.status
  if (subresourceId && subresourceList.length > 1) {
    // can be partial status
    switch (current) {
      case 'paid':
      case 'refunded':
      case 'shipped':
      case 'delivered':
        for (let i = 0; i < subresourceList.length; i++) {
          const otherStatus = subresourceList[i].status
          if (otherStatus && otherStatus.current !== current) {
            current = 'partially_' + current
            break
          }
        }
        break
    }
  }
  return current
}

module.exports = ({ appSdk, storeId, auth }, order, fieldStatus, fieldRecords, fieldSubresource) => {
  // get current order status first
  const url = '/orders/' + order._id + '.json'
  const method = 'GET'
  const data = {}
  const noAuth = true

  // send public API request
  appSdk.apiRequest(storeId, url, method, data, auth, noAuth).then(({ response }) => {
    // logger.log(fieldSubresource)
    const orderBody = response.data
    // save current order status
    const lastStatusObject = orderBody[fieldStatus]
    let lastStatus
    // select last received status record to compare
    const statusRecord = getLastRecord(order[fieldRecords]) || {}
    if (lastStatusObject) {
      if (statusRecord.date_time && lastStatusObject.updated_at >= statusRecord.date_time) {
        // status already edited
        return
      } else {
        lastStatus = lastStatusObject.current
        if (lastStatus === statusRecord.status) {
          // status not changed at all
          return
        }
      }
    }

    // wait to check if status will be changed manually
    setTimeout(() => {
      // send authenticated API request to GET full order body
      appSdk.apiRequest(storeId, url, method, data, auth).then(({ response }) => {
        const orderBody = response.data
        const subresourceList = orderBody[fieldSubresource]
        if (!subresourceList || !subresourceList.length) {
          // no transactions or shipping lines ?
          return
        }
        // validate subresource ID if defined on status record object
        // 'transaction_id' or 'shipping_line_id'
        const subresourceId = statusRecord[fieldSubresource.slice(0, -1) + '_id']
        if (subresourceId && !subresourceList.find(obj => obj._id === subresourceId)) {
          // invalid transaction or shipping line ?
          return
        }

        // check if no new record was inserted
        const lastStatusRecord = getLastRecord(orderBody[fieldRecords])
        // logger.log(lastStatusRecord)
        // logger.log(statusRecord)
        if (lastStatusRecord && lastStatusRecord._id === statusRecord._id) {
          // current status record is the last
          // logger.log(orderBody[fieldStatus].current)
          if (!lastStatus || !orderBody[fieldStatus] || orderBody[fieldStatus].current === lastStatus) {
            // main status not updated
            const current = currentStatus(lastStatusRecord, subresourceId, subresourceList)
            const statusObject = {
              updated_at: lastStatusRecord.date_time || new Date().toISOString(),
              current
            }
            // logger.log(statusObject)

            // mount body to edit order object
            const method = 'PATCH'
            const data = {}
            data[fieldStatus] = statusObject
            // handle new order main status
            data.status = orderMainStatus(Object.assign(orderBody, data))

            // add records field to edit data
            data[fieldRecords] = orderBody[fieldRecords].map(statusRecord => {
              // mark status record as handled with flags (minor)
              let { flags } = statusRecord
              const flag = statusRecord._id === lastStatusRecord._id ? 'cpm:patch' : 'cpm-skip'
              if (flag !== flags[0]) {
                if (flags) {
                  if (flags.length > 9) {
                    flags.pop()
                    flags.unshift(flag)
                  }
                } else {
                  flags = [flag]
                }
                statusRecord.flags = flags
              }
              return statusRecord
            })

            // send authenticated API request to edit order
            return appSdk.apiRequest(storeId, url, method, data, auth).then(() => {
              const fixedSubresourceId = subresourceId ||
                subresourceList.length === 1 ? subresourceList[0]._id : null
              if (fixedSubresourceId) {
                // also updates subresource object
                // get current order main status first
                const url = '/orders/' + order._id + '/' +
                  fieldSubresource + '/' + fixedSubresourceId + '.json'
                const method = 'PATCH'
                const data = { status: statusObject }

                // send authenticated API request to edit subresource
                return appSdk.apiRequest(storeId, url, method, data, auth)
              }
            })
          }
        }
      }).catch(errorHandling)
    }, 60000)
  })
}
