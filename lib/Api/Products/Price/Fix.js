'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')

const addToHistory = (appSdk, storeId, auth, productId, variationId, itemBody) => {
  const url = '/products/' + productId + '/price_change_records.json'
  const method = 'POST'
  const data = {
    date_of_change: new Date().toISOString()
  }
  if (variationId && variationId.trim()) {
    data.variation_id = variationId
  }

  // copy fields from product or variation body
  for (const field in itemBody) {
    if (itemBody[field] !== undefined) {
      switch (field) {
        case 'currency_id':
        case 'currency_symbol':
        case 'price':
          data[field] = itemBody[field]
          break
      }
    }
  }

  // send authenticated API request asynchronously
  appSdk.apiRequest(storeId, url, method, data, auth)
}

module.exports = ({ client, product, removeAll, appConfig }) => {
  return new Promise(resolve => {
    const end = () => resolve({ client, product, removeAll, appConfig })
    const fn = appConfig => {
      // add product price changes to history
      if (appConfig.disable_fix_product_price !== true) {
        // check if product or variation sale price was changed
        const { variations } = product
        let priceChanged = false
        let variation
        if (variations && variations.length) {
          // variation edited
          for (let i = 0; i < variations.length; i++) {
            if (variations[i].price >= 0) {
              variation = variations[i]
              priceChanged = true
              break
            }
          }
        } else if (product.price >= 0) {
          // main product price edited
          priceChanged = true
        }

        if (priceChanged) {
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
              const productBody = response.data
              let itemBody, variationId

              if (variation) {
                // check if variation exists on product body
                if (productBody.variations) {
                  const variationBody = product.variations.find(body => body._id === variation._id)
                  // check if handling the current variation price
                  if (variationBody && variationBody.price === variation.price) {
                    variationId = variation._id
                    itemBody = variationBody
                  } else {
                    return
                  }
                }
              } else if (productBody.price === product.price) {
                // main product price edited
                variationId = null
                itemBody = productBody
              } else {
                // price changed again ?
                return
              }

              if (productBody.price_change_records) {
                // check if price change record was not already saved
                let lastRecord
                productBody.price_change_records.forEach(record => {
                  if (!lastRecord || record.date_of_change >= lastRecord.date_of_change) {
                    lastRecord = record
                  }
                })
                if (lastRecord && lastRecord.price === itemBody.price) {
                  // already saved
                  return
                }
              }

              // save price change to history
              addToHistory(appSdk, storeId, auth, product._id, variationId, itemBody)
            }).catch(errorHandling)
          }, 60000)
        }
      }

      // end promise without waiting full async process
      end()
    }

    // call function with app config object
    appConfig ? fn(appConfig) : getConfig(client).then(fn)
  })
}
