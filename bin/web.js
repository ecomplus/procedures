'use strict'

// log on files
const logger = require('console-files')

// handle app authentication to Store API
// https://github.com/ecomclub/ecomplus-auth-node
const dbFilename = process.env.DB_FILENAME || process.cwd() + '/cpm.db'
const apiAuth = require('ecomplus-app-auth')(dbFilename)

console.log(apiAuth)
apiAuth.catch(err => {
  logger.error(err)
})

.then(auth => {
  // setup REST API server
  // https://www.npmjs.com/package/rest-auto-router
  const restAutoRouter = require('rest-auto-router')

  // web server configuration
  const conf = {
    // path to routes folder
    'path': process.cwd() + '/routes/',
    // listened tcp port
    // should be opened for localhost only
    'port': parseInt(process.env.PROXY_PORT, 10) || 3000,
    // part of the URL to be deleted in routing
    // like RewriteBase of Apache Httpd mod_rewrite
    'base_uri': process.env.PROXY_BASE_URI || '/api/v1/',
    // must be configured in common with proxy server
    'proxy': {
      // request timeout in ms
      'timeout': parseInt(process.env.PROXY_TIMEOUT, 10) || 30000,
      // X-Authentication header
      'auth': process.env.PROXY_AUTH || 'FnN3sT4'
    },
    // default error messages
    // used when messages are null
    'error_messages': {
      'dev': 'Unknow error',
      'usr': {
        'en_us': 'Unexpected error, report to support or responsible developer',
        'pt_br': 'Erro inesperado, reportar ao suporte ou desenvolvedor responsável'
      }
    },
    // allow clients to specify what fields to receive from resource
    // if true, response should vary by http param 'fields'
    'vary_fields': false
  }

  const middleware = (id, meta, body, respond, req, res, resource, verb, endpoint) => {
    // function called before endpoints
    // authentications and other prerequisites when necessary
    // requires store ID
    let storeId = req.headers['x-store-id']
    if (typeof storeId === 'string') {
      storeId = parseInt(storeId, 10)
    }
    if (typeof storeId !== 'number' || isNaN(storeId) || storeId < 0) {
      // invalid ID string
      respond({}, null, 403, 121, 'Undefined or invalid Store ID')
    } else {
      // pass to endpoint
      endpoint(id, meta, body, respond, storeId, auth)
    }
  }

  // start web application
  // recieve requests from Nginx by reverse proxy
  restAutoRouter(conf, middleware, logger)

  // debug
  logger.log('Web application running on port ' + conf.port)
})
