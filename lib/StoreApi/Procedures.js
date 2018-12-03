'use strict'

// APP hostname and base URL path
const appBaseUri = process.env.APP_BASE_URI
// APP name to procedures titles
const appName = 'E-Com Plus CPM'

module.exports = [
  {
    'title': appName + ': new order',
    'triggers': [
      {
        'method': 'POST',
        'resource': 'orders'
      }
    ],
    'webhooks': [
      {
        'api': {
          'external_api': {
            'uri': appBaseUri + '/new_order.json'
          }
        },
        'method': 'POST'
      }
    ]
  },
  {
    'title': appName + ': new product',
    'triggers': [
      {
        'method': 'POST',
        'resource': 'products'
      }
    ],
    'webhooks': [
      {
        'api': {
          'external_api': {
            'uri': appBaseUri + '/new_product.json'
          }
        },
        'method': 'POST'
      }
    ]
  }
]
