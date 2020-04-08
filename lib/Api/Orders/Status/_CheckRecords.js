'use strict'

// log on files
// const logger = require('console-files')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// common handlers
const getLastRecord = require('./_GetLastRecord')

module.exports = ({ appSdk, storeId, auth }, fullOrder, mustCheckRecords) => {
  if (mustCheckRecords) {
    for (const fieldRecords in mustCheckRecords) {
      const status = mustCheckRecords[fieldRecords]
      if (status) {
        // check if last record matches the current status
        const records = fullOrder[fieldRecords]
        if (records) {
          const lastRecord = getLastRecord(records)
          if (lastRecord) {
            if (lastRecord.status === status) {
              // it's up to date
              continue
            }
            // check is status record was handled
            if (!lastRecord.flags || !lastRecord.flags.find(flag => flag.startsWith('cpm:'))) {
              // check if last record is recent by date (one hour)
              if (!lastRecord.date_time || Date.now() - new Date(lastRecord.date_time).getTime() < 3600000) {
                continue
              }
            }
          }
        }

        // must create a new record with current status
        // https://developers.e-com.plus/docs/api/#/store/orders
        const url = '/orders/' + fullOrder._id + '/' + fieldRecords + '.json'
        const method = 'POST'
        const data = {
          status,
          date_time: new Date().toISOString(),
          flags: ['cpm', 'cpm:post']
        }

        // send authenticated API request
        appSdk.apiRequest(storeId, url, method, data, auth).catch(errorHandling)
      }
    }
  }
}
