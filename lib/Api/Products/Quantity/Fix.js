'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')

module.exports = ({ client, product, removeAll, appConfig }) => {
  return new Promise(resolve => {
    const end = () => resolve({ client, product, removeAll, appConfig })
    const fn = appConfig => {
      // fix product quantity to match with sum of variations quantities
      if (appConfig.disable_fix_product_quantity !== true) {
        // delay to wait manual changes
        setTimeout(() => {
          const { appSdk, storeId, auth } = client

          // read full product body first
          const url = '/products/' + product._id + '.json'
          const method = 'GET'
          const data = {}
          const noAuth = true

          // send public API request
          appSdk.apiRequest(storeId, url, method, data, auth, noAuth, { timeout: 10000 }).then(({ response }) => {
            const { quantity, variations } = response.data
            if (variations && variations.length) {
              // sum all variations quantities to check with product
              let variationsQnt = 0
              let hasQuantity = false
              variations.forEach(({ quantity }) => {
                if (typeof quantity === 'number') {
                  variationsQnt += quantity
                  if (!hasQuantity) {
                    hasQuantity = true
                  }
                }
              })

              if (hasQuantity && variationsQnt !== quantity) {
                // must fix main product quantity
                const method = 'PATCH'
                const data = {
                  quantity: variationsQnt
                }

                // send authenticated API request to edit product
                return appSdk.apiRequest(storeId, url, method, data, auth)
              }
            }
          }).catch(errorHandling)
        }, 60000)
      }

      // end promise without waiting full async process
      end()
    }

    // call function with app config object
    appConfig ? fn(appConfig) : getConfig(client).then(fn)
  })
}
