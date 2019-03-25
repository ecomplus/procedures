'use strict'

// log on files
const logger = require('console-files')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// common handlers
const getLastRecord = require('./_GetLastRecord')

module.exports = ({ appSdk, storeId, auth }, fullOrder, mustCheckRecords) => {
  if (mustCheckRecords) {
    for (let fieldRecords in mustCheckRecords) {
      let status = mustCheckRecords[fieldRecords]
      if (status) {
        // check if last record matches the current status
        let records = fullOrder[fieldRecords]
        let lastRecord
        if (records) {
          lastRecord = getLastRecord(records)
        }
        logger.log(fieldRecords)
        logger.log(status)
        logger.log(lastRecord)
        if (lastRecord && lastRecord.status === status) {
          // it's up to date
          continue
        }

        // must create a new record with current status
        // https://developers.e-com.plus/docs/api/#/store/orders
        const url = '/orders/' + fullOrder._id + '/' + fieldRecords + '.json'
        const method = 'POST'
        const data = {
          status,
          date_time: new Date().toISOString()
        }

        // send authenticated API request
        appSdk.apiRequest(storeId, url, method, data, auth).catch(errorHandling)
      }
    }
  }
}
