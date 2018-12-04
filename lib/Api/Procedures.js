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
        'subresource': '*'
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
