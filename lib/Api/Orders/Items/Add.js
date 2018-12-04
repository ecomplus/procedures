'use strict'

// log on files
// const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')
// MySQL database connection
const db = require(process.cwd() + '/lib/Database')

module.exports = (client, order, appConfig) => {
  return new Promise(resolve => {
    const fn = appConfig => {
      // decrease order items stock quantity
      if (order.items && appConfig.skip_add_order_items !== true) {
        let { appSdk, storeId, auth } = client
        ;(async function loop () {
          for (let i = 0; i < order.items.length; i++) {
            let item = order.items[i]

            await new Promise((resolve, reject) => {
              // read product first
              // https://developers.e-com.plus/docs/api/#/store/products/products
              const url = '/products/' + item.product_id + '.json'
              const method = 'GET'
              const data = {}
              const noAuth = true

              // send public API request
              appSdk.apiRequest(storeId, url, method, data, auth, noAuth).then(({ response }) => {
                const product = response.data
                if (product.manage_stock) {
                  let variation
                  if (item.variation_id) {
                    if (product.variations) {
                      variation = product.variations.find(variation => variation._id === item.variation_id)
                    }
                    if (!variation) {
                      // ignore invalid variation ID
                      return resolve()
                    }
                  }

                  // edit current product or variation stock
                  let quantity = variation ? variation.quantity : product.quantity
                  if (typeof quantity !== 'number') {
                    // no stock limitation
                    return resolve()
                  }
                  quantity -= item.quantity
                  if (quantity < 0) {
                    quantity = 0
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

                  // send authenticated API request
                  appSdk.apiRequest(storeId, url, method, data, auth)

                  .then(() => {
                    // update product sales metrics
                    const url = '/products/' + product._id + '.json'
                    const method = 'PATCH'
                    const data = {
                      sales: (product.sales || 0) + 1,
                      total_sold: (product.total_sold || 0) + item.price * item.quantity
                    }

                    // send API request and overwrite current promise
                    return appSdk.apiRequest(storeId, url, method, data, auth)
                  })

                  .then(() => {
                    // ready
                    resolve()
                    // insert into database
                    let values = {
                      store_id: storeId,
                      order_id: order._id,
                      item_id: item._id,
                      product_id: item.product_id,
                      variation_id: variation ? variation._id : null,
                      quantity: item.quantity,
                      price: item.price
                    }
                    db.query('REPLACE INTO order_items SET ?', values)

                    // add product inventory change record
                    const url = '/products/' + product._id + '/inventory_records.json'
                    const method = 'POST'
                    const data = {
                      date_of_change: order.created_at,
                      origin: 'Order ' + order._id,
                      quantity: -item.quantity
                    }
                    if (variation) {
                      data.variation_id = variation._id
                    }

                    // send authenticated API request asynchronously
                    appSdk.apiRequest(storeId, url, method, data, auth).catch(errorHandling)
                  })

                  .catch(reject)
                }
              })
            }).catch(errorHandling)
          }

          // all done
          resolve(client, order, appConfig)
        }())
      }
    }

    // call function with app config object
    appConfig ? fn(appConfig) : getConfig(client).then(fn)
  })
}
