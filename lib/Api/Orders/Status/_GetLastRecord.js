'use strict'

module.exports = records => {
  // select last status record by date
  let statusRecord
  records.forEach(record => {
    if (record && (!statusRecord || !record.updated_at || record.updated_at >= statusRecord.updated_at)) {
      statusRecord = record
    }
  })
  return statusRecord
}
