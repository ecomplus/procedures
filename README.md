# procedures

[![CodeFactor](https://www.codefactor.io/repository/github/ecomplus/procedures/badge)](https://www.codefactor.io/repository/github/ecomplus/procedures)
[![license gpl](https://img.shields.io/badge/License-Apache-orange.svg)](https://opensource.org/licenses/Apache-2.0)

## Common Procedures Manager
App to handle the most common E-Com Plus Store API procedures

### Environment variables sample
Variable              | Value
---                   | ---
`LOGGER_OUTPUT`       | `~/app/log/logger.out`
`LOGGER_ERRORS`       | `~/app/log/logger.err`
`LOGGER_FATAL_ERRORS` | `~/app/log/_stderr`
`PROXY_PORT`          | `3000`
`PROXY_AUTH`          | `auth_token`
`DB_HOST`             | `localhost`
`DB_NAME`             | `appdb`
`DB_USERNAME`         | `dbuser`
`DB_PASSWORD`         | `dbpassword`
`ECOM_AUTH_DB`        | `~/app/db.sqlite`
`APP_BASE_URI`        | `https://app.ecomplus.biz/api/v1`

## Production server

Published at https://cpm.ecomplus.biz

### Continuous deployment

When app version is **production ready**,
[create a new release](https://github.com/ecomplus/procedures/releases)
to run automatic deploy from `master` branch.
