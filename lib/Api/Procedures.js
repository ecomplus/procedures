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
  }
]
