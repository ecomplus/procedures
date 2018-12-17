'use strict'

// log on files
const logger = require('console-files')
// read configured app config data
const getConfig = require(process.cwd() + '/lib/Api/AppConfig')
// handle Store API errors
const errorHandling = require(process.cwd() + '/lib/Api/ErrorHandling')

module.exports = ({ client, order, removeAll, appConfig }) => {
  return new Promise(resolve => {
    const end = () => resolve({ client, order, removeAll, appConfig })
    const fn = appConfig => {
      // create payment history entry for new transactions
      let { transactions } = order
      if (transactions && appConfig.skip_add_order_transactions !== true) {
        let { appSdk, storeId, auth } = client
        ;(async function loop () {
          for (let i = 0; i < transactions.length; i++) {
            let transaction = transactions[i]
            let { status } = transaction.status
            logger.log(status)

            // check if transaction status is defined
            if (status && status.current) {
              // add payment history to order
              // https://developers.e-com.plus/docs/api/#/store/orders/orders
              const url = '/orders/' + order._id + '/payments_history.json'
              const method = 'POST'
              const data = {
                transaction_id: transaction._id,
                date_time: status.updated_at || transaction.created_at || new Date().toISOString(),
                status: status.current
              }

              // send authenticated API request
              await appSdk.apiRequest(storeId, url, method, data, auth).catch(errorHandling)
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
