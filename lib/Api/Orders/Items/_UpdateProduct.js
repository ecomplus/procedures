'use strict'

// log on files
// const logger = require('console-files')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')

module.exports = ({ appSdk, storeId, auth }, order, item, appConfig, addingSale = true) => {
  return new Promise(resolve => {
    // read product first
    // https://developers.e-com.plus/docs/api/#/store/products/products
    const url = '/products/' + item.product_id + '.json'
    const method = 'GET'
    const data = {}
    const noAuth = true

    // send public API request
    appSdk.apiRequest(storeId, url, method, data, auth, noAuth).then(({ response }) => {
      // product body
      const product = response.data

      const updateStock = (function () {
        if (product.manage_stock) {
          let variation
          if (item.variation_id) {
            if (product.variations) {
              variation = product.variations.find(variation => variation._id === item.variation_id)
            }
            if (!variation) {
              // ignore invalid variation ID
              return Promise.resolve()
            }
          }

          // edit current product or variation stock
          let quantity = variation ? variation.quantity : product.quantity
          if (typeof quantity !== 'number') {
            // no stock limitation
            return Promise.resolve()
          }
          if (addingSale) {
            // new order
            // decrease stock
            quantity -= item.quantity
            if (quantity < 0) {
              quantity = 0
            }
          } else {
            // order cancelled
            // increase stock
            quantity += item.quantity
          }

          // request to quantity subresource
          let url = '/products/' + item.product_id
          if (variation) {
            url += '/variations/' + variation._id
          }
          url += '/quantity.json'
          const method = 'PUT'
          const data = {
            quantity
          }

          return new Promise(resolve => {
            // send authenticated API request
            appSdk.apiRequest(storeId, url, method, data, auth).then(() => {
              // stock updated
              resolve()

              // add product inventory change record
              const url = '/products/' + product._id + '/inventory_records.json'
              const method = 'POST'
              const data = {
                date_of_change: new Date().toISOString(),
                origin: 'Order #' + order.number + ' (' + order._id + ')',
                quantity: addingSale ? -item.quantity : item.quantity
              }
              if (variation) {
                data.variation_id = variation._id
              }

              // send authenticated API request asynchronously
              appSdk.apiRequest(storeId, url, method, data, auth).catch(errorHandling)
            })

            .catch(err => {
              // resolve anyway
              resolve()
              errorHandling(err)
            })
          })
        }
      }())

      const updateSales = (function () {
        if (appConfig.disable_product_sales_control !== true) {
          // update product sales metrics
          const url = '/products/' + product._id + '.json'
          const method = 'PATCH'
          let data
          if (addingSale) {
            // increase total sold amount
            data = {
              sales: (product.sales || 0) + 1,
              total_sold: (product.total_sold || 0) + item.price * item.quantity
            }
          } else {
            // decrease sold amount
            data = {}
            if (product.sales) {
              data.sales = product.sales - 1
            }
            if (product.total_sold) {
              data.total_sold = product.total_sold - item.price * item.quantity
              if (data.total_sold < 0) {
                data.total_sold = 0
              }
            }
          }

          return new Promise(resolve => {
            // send authenticated API request
            appSdk.apiRequest(storeId, url, method, data, auth).then(resolve).catch(err => {
              // resolve anyway
              resolve()
              errorHandling(err)
            })
          })
        } else {
          return Promise.resolve()
        }
      }())

      Promise.all([ updateStock, updateSales ]).then(resolve)
    }).catch(err => {
      // resolve main promise anyway
      resolve()
      errorHandling(err)
    })
  })
}
