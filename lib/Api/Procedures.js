'use strict'

// APP hostname and base URL path
const appBaseUri = process.env.APP_BASE_URI
// APP name to procedures titles
const appName = 'E-Com Plus CPM'

module.exports = [
  {
    'title': appName + ': order',
    'triggers': [
      {
        'resource': 'orders',
        'subresource': null
      },
      {
        'resource': 'orders',
        'subresource': 'items'
      },
      {
        'resource': 'orders',
        'subresource': 'buyers',
        'method': 'POST'
      },
      {
        'resource': 'orders',
        'subresource': 'buyers',
        'method': 'DELETE'
      },
      {
        'resource': 'orders',
        'subresource': 'payments_history'
      },
      {
        'resource': 'orders',
        'subresource': 'fulfillments'
      }
    ],
    'webhooks': [
      {
        'api': {
          'external_api': {
            'uri': appBaseUri + '/order.json'
          }
        },
        'method': 'POST'
      }
    ]
  },
  {
    'title': appName + ': product stock',
    'triggers': [
      {
        'resource': 'products',
        'subresource': null,
        'field': 'quantity'
      },
      {
        'resource': 'products',
        'subresource': 'variations',
        'field': 'quantity'
      },
      {
        'resource': 'products',
        'subresource': null,
        'field': 'price'
      },
      {
        'resource': 'products',
        'subresource': 'variations',
        'field': 'price'
      },
      {
        'resource': 'products',
        'subresource': 'variations',
        'method': 'DELETE'
      },
      {
        'resource': 'products',
        'subresource': 'price_change_records',
        'method': 'POST'
      },
      {
        'resource': 'products',
        'subresource': 'inventory_records',
        'method': 'POST'
      }
    ],
    'webhooks': [
      {
        'api': {
          'external_api': {
            'uri': appBaseUri + '/product.json'
          }
        },
        'method': 'POST'
      }
    ]
  },
  {
    'title': appName + ': customer orders',
    'triggers': [
      {
        'resource': 'customers',
        'subresource': 'orders'
      }
    ],
    'webhooks': [
      {
        'api': {
          'external_api': {
            'uri': appBaseUri + '/customer.json'
          }
        },
        'method': 'POST'
      }
    ]
  }
]
