'use strich'

// handle app authentication to Store API
// https://github.com/ecomclub/ecomplus-auth-node
const dbFilename = process.env.DB_FILENAME || process.cwd() + '/cpm.db'
const apiAuth = require('ecomplus-app-auth')(dbFilename)

// exports promise
module.exports = apiAuth
