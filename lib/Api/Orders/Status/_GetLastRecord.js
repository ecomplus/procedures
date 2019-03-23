'use strict'

module.exports = records => {
  // select last status record by date
  let statusRecord
  records.forEach(record => {
    if (record && (!statusRecord || !record.date_time || record.date_time >= statusRecord.date_time)) {
      statusRecord = record
    }
  })
  return statusRecord
}
