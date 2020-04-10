# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.11](https://github.com/ecomplus/procedures/compare/v0.3.10...v0.3.11) (2020-04-10)

### [0.3.10](https://github.com/ecomplus/procedures/compare/v0.3.9...v0.3.10) (2020-04-10)

### [0.3.9](https://github.com/ecomplus/procedures/compare/v0.3.8...v0.3.9) (2020-04-09)


### Bug Fixes

* **order-new-status:** fix handling flags, check array first ([fd39a53](https://github.com/ecomplus/procedures/commit/fd39a5306e36958ae2ccdb6a42a7d1be55041b0f))

### [0.3.8](https://github.com/ecomplus/procedures/compare/v0.3.7...v0.3.8) (2020-04-08)


### Bug Fixes

* **order-new-record:** fix adding new flag to existent flags array ([58f0c30](https://github.com/ecomplus/procedures/commit/58f0c30d0d687d385bbe29bd72a35ac935b6ad7c))

### [0.3.7](https://github.com/ecomplus/procedures/compare/v0.3.6...v0.3.7) (2020-04-08)


### Bug Fixes

* **order-new-record:** using array map to records field with fixed flags ([3083b85](https://github.com/ecomplus/procedures/commit/3083b8557faa70c8626b06cf29f862c24c99f5d0))

### [0.3.6](https://github.com/ecomplus/procedures/compare/v0.3.5...v0.3.6) (2020-04-08)


### Bug Fixes

* **order-new-record:** prevent duplicating status record first flags ([2916d51](https://github.com/ecomplus/procedures/commit/2916d51e6e3d9dc7574386c300830f4b487d0993))

### [0.3.5](https://github.com/ecomplus/procedures/compare/v0.3.4...v0.3.5) (2020-04-08)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.9 ([fedd529](https://github.com/ecomplus/procedures/commit/fedd529e7c44d273c0e1bbe3af5f1d533b76693a))
* **order-new-record:** add records field to order edit data ([7032a73](https://github.com/ecomplus/procedures/commit/7032a732bf18821912b1300eb6104ac2cbbc949b))
* **order-new-record:** debug update record request error ([20114bc](https://github.com/ecomplus/procedures/commit/20114bcab8ecf9b62dd2f49b0ff7785afde3e9b1))

### [0.3.4](https://github.com/ecomplus/procedures/compare/v0.3.3...v0.3.4) (2020-04-08)


### Bug Fixes

* **order-status:** fix handling status records flags ([364237c](https://github.com/ecomplus/procedures/commit/364237cf765bbfb7d6c4a36e513fed1c844d89f8))
* **order-status:** only one 'cpm:post' flag on new record created ([2be56bb](https://github.com/ecomplus/procedures/commit/2be56bb165a7184e821ff972a8114f9c59852772))

### [0.3.3](https://github.com/ecomplus/procedures/compare/v0.3.2...v0.3.3) (2020-04-08)


### Bug Fixes

* **order-status:** mark status record as handled with flags ([8bf441a](https://github.com/ecomplus/procedures/commit/8bf441a43177db55d91f45b2ed1ec8880d24cf02))
* **order-status:** skip creating new record if last was not handled yet ([66fc7a0](https://github.com/ecomplus/procedures/commit/66fc7a02f88949b6dcee8743603b8e22f491cd27))
* **order-status:** skip new records with 'cpm' flag ([f34934e](https://github.com/ecomplus/procedures/commit/f34934e15355b8f6e574baa63819dc797d8c41e5))

### [0.3.2](https://github.com/ecomplus/procedures/compare/v0.3.1...v0.3.2) (2020-03-18)


### Bug Fixes

* **deps:** update/fix direct pkg dependencies ([77858e8](https://github.com/ecomplus/procedures/commit/77858e840596914618d79b10e6375575226d5d25))

### [0.3.1](https://github.com/ecomplus/procedures/compare/v0.3.0...v0.3.1) (2020-03-18)


### Bug Fixes

* **bin:** replace ecomplus-app-sdk with @ecomplus/application-sdk ([05a8371](https://github.com/ecomplus/procedures/commit/05a8371ef806b6ed64ed9541cdd671c1a2762e1e))
* **order-items:** must save 'variation_id' not empty on db ([ca85f68](https://github.com/ecomplus/procedures/commit/ca85f6833737b4db37444ca7517728e33d6e2c20))
* **order-new-record:** fix (check) subresource id with updating ([771f766](https://github.com/ecomplus/procedures/commit/771f7662fb9191aba353b76f630efd3a8ce98555))
