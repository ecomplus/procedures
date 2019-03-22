'use strict'

// log on files
// const logger = require('console-files')
// handle Store API errors
// const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// common handlers
const getLastRecord = require('./_GetLastRecord')

module.exports = ({ appSdk, storeId, auth }, fullOrder, fieldsRecords) => {
  if (Array.isArray(fieldsRecords)) {
    fieldsRecords.forEach(fieldRecords => {
      // check if last record matches the current status
      let records = fullOrder[fieldRecords]
      let lastRecord
      if (records) {
        lastRecord = getLastRecord(records)
      }
      if (lastRecord && lastRecord.status) {
      }
    })
  }
}
