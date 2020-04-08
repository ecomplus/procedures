# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
