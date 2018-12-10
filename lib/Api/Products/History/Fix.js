'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')

module.exports = ({ client, product, removeAll, appConfig, fullProduct }) => {
  return new Promise(resolve => {
    const end = () => resolve({ client, product, removeAll, appConfig, fullProduct })
    const fn = appConfig => {
      // do not permit to exceed limit of history records
      let fieldHistory, newRecord
      if (product.inventory_records && product.inventory_records.length) {
        fieldHistory = 'inventory_records'
      } else if (product.price_change_records && product.price_change_records.length) {
        fieldHistory = 'price_change_records'
      }
      if (fieldHistory) {
        newRecord = product[fieldHistory][0]
      }

      if (newRecord && newRecord.date_of_change && appConfig.skip_fix_product_history !== true) {
        ;(async function delayed () {
          let { appSdk, storeId, auth } = client

          if (!fullProduct) {
            // read full product body first
            const url = '/products/' + product._id + '.json'
            const method = 'GET'
            const data = {}
            const noAuth = true

            // send public API request
            await appSdk.apiRequest(storeId, url, method, data, auth, noAuth).then(({ response }) => {
              fullProduct = response.data
            }).catch(errorHandling)
          }

          if (fullProduct && fullProduct[fieldHistory]) {
            let quit = false
            // order array of records by date
            let records = fullProduct[fieldHistory]
            records.sort((a, b) => {
              return a.date_of_change > b.date_of_change
            })

            while (records.length > 160 && !quit) {
              // delete the oldest record by date
              let oldRecord = records[0]

              if (oldRecord) {
                // remove record object from subresource URL
                const url = '/products/' + product._id + '/' +
                  fieldHistory + '/' + oldRecord._id + '.json'
                const method = 'DELETE'
                const data = {}

                // send authenticated API delete request
                await appSdk.apiRequest(storeId, url, method, data, auth).then(() => {
                  // remove record from array
                  records.shift()
                }).catch(err => {
                  errorHandling(err)
                  // exit from while loop
                  quit = true
                })
              }
            }
          }

          // all done
          end()
        }())
      } else {
        end()
      }
    }

    // call function with app config object
    appConfig ? fn(appConfig) : getConfig(client).then(fn)
  })
}
