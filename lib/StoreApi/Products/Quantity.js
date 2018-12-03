'use strict'

// log on files
const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/StoreApi/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/StoreApi/ErrorHandling')
// SQLite3 database
const db = require(process.cwd() + '/lib/Database')

const setQuantity = (client, product, quantity) => {
  let { appSdk, storeId, auth } = client
  // update product quantity
  // https://developers.e-com.plus/docs/api/#/store/products/products
  const url = '/products/' + product._id + '/quantity.json'
  const method = 'PUT'
  const data = { quantity }
  // send authenticated API request
  appSdk.apiRequest(storeId, url, method, data, auth).catch(errorHandling)
}

module.exports = {
  setup (client, product) {
    // check if product or variation has defined quantity
    let { variations } = product
    let hasQuantity = false
    let hasVariations = (variations && variations.length)
    if (hasVariations) {
      // product with variations
      for (let i = 0; i < variations.length; i++) {
        if (variations[i].hasOwnProperty('quantity')) {
          hasQuantity = true
        }
      }
    } else if (product.hasOwnProperty('quantity')) {
      // simple product
      hasQuantity = true
    }

    if (hasQuantity) {
      getConfig(client).then(appConfig => {
        if (appConfig.disable_stock_control !== true) {
          // setup for stock control
          let { storeId } = client
          // insert or replace current item quantity on database
          let sql = `REPLACE INTO stock_control (
            store_id,
            product_id,
            variation_id,
            last_read_quantity
          ) VALUES (?, ?, ?, ?)`

          // run query
          const run = (variationId = null, quantity) => {
            let values = [ storeId, product._id, variationId, quantity ]
            db.run(sql, values, err => {
              if (err) {
                logger.error(err)
              }
            })
          }

          if (!hasVariations) {
            // single product
            run(null, product.quantity)
          } else {
            // sum variations quantities
            let variationsQnt = 0
            // insert each variation quantity
            product.variations.forEach(variation => {
              if (variation.hasOwnProperty('quantity')) {
                let qnt = variation.quantity
                variationsQnt += qnt
                run(variation._id, qnt)
              }
            })
            if (variationsQnt !== product.quantity && appConfig.ignore_unmatch_stock !== true) {
              // fix product stock to be the same as variations sum
              setQuantity(client, product, variationsQnt)
            }
          }
        }
      })
    }
  }
}
