# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.28](https://github.com/ecomplus/procedures/compare/v1.0.27...v1.0.28) (2021-10-17)


### Bug Fixes

* **order:** keep status fix without checking records ([debd867](https://github.com/ecomplus/procedures/commit/debd867e39032f003b28b3397db113dc48ee03e6))

### [1.0.27](https://github.com/ecomplus/procedures/compare/v1.0.26...v1.0.27) (2021-10-17)


### Bug Fixes

* **order:** skip status fix at all ([58e8b24](https://github.com/ecomplus/procedures/commit/58e8b2420892a096155f09c2fd767f4f86e7da8f))

### [1.0.26](https://github.com/ecomplus/procedures/compare/v1.0.25...v1.0.26) (2021-10-17)


### Bug Fixes

* **order:** handle status fix on order create or root edit only ([16e20c0](https://github.com/ecomplus/procedures/commit/16e20c0bf59a067690405d0bbcbaaac05dbd7957))

### [1.0.25](https://github.com/ecomplus/procedures/compare/v1.0.24...v1.0.25) (2021-09-01)

### [1.0.24](https://github.com/ecomplus/procedures/compare/v1.0.23...v1.0.24) (2021-08-28)

### [1.0.23](https://github.com/ecomplus/procedures/compare/v1.0.22...v1.0.23) (2021-08-25)


### Bug Fixes

* **order-items:** check externally handled stock status ([e166ad9](https://github.com/ecomplus/procedures/commit/e166ad9f48a904b8a22b53aed197ef06c0c27376))

### [1.0.22](https://github.com/ecomplus/procedures/compare/v1.0.21...v1.0.22) (2021-06-24)

### [1.0.21](https://github.com/ecomplus/procedures/compare/v1.0.20...v1.0.21) (2021-05-19)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.14.11 ([4ac4b35](https://github.com/ecomplus/procedures/commit/4ac4b357055b5e1f09536c6e53eefcc117e6f28a))
* **orders/new-record:** fix handling partial status ([b0a9654](https://github.com/ecomplus/procedures/commit/b0a9654876c531d46d01ba1b85fc7e8c560461f5))

### [1.0.20](https://github.com/ecomplus/procedures/compare/v1.0.19...v1.0.20) (2020-10-30)


### Bug Fixes

* **add-order-items:** fix mappnig row as item ('item_id' to '_id') ([6481960](https://github.com/ecomplus/procedures/commit/6481960ad37d432e37832aaabd1cf1a63ce87f3b))

### [1.0.19](https://github.com/ecomplus/procedures/compare/v1.0.18...v1.0.19) (2020-10-30)


### Bug Fixes

* **add-order-items:** run all without checking rows if 'addAll' only ([8a261e1](https://github.com/ecomplus/procedures/commit/8a261e18421acdbf7c6cede22fff7181f3934bfb))
* **orders-webhooks:** set 'addAll' for new orders ([a6f15af](https://github.com/ecomplus/procedures/commit/a6f15af67749b5fb3099227f7ccda07f5dcb9a74))
* **remove-order-items:** fix awaiting update product and query promise ([e0d20a1](https://github.com/ecomplus/procedures/commit/e0d20a175221211b74e23021358804707ba02b8e))

### [1.0.18](https://github.com/ecomplus/procedures/compare/v1.0.17...v1.0.18) (2020-10-30)

### [1.0.17](https://github.com/ecomplus/procedures/compare/v1.0.16...v1.0.17) (2020-10-30)


### Bug Fixes

* **add-order-items:** fix checking changed items or rows not decreased ([ad1d27c](https://github.com/ecomplus/procedures/commit/ad1d27c6396ee28bb1d478233d0925922ba6c2aa))
* **order-items:** prevent duplicate inventory reductions on order change ([cb6f67f](https://github.com/ecomplus/procedures/commit/cb6f67f03fed75ee83140e6813a4df8135bf5737))
* **order-items-add:** must end process when nothing to do ([ac18826](https://github.com/ecomplus/procedures/commit/ac18826c57015a9d2fd1b36da90c5f17d37522a7))

### [1.0.16](https://github.com/ecomplus/procedures/compare/v1.0.15...v1.0.16) (2020-10-23)


### Bug Fixes

* **remove-order-items:** check if order.items is array to try item find ([ed18f1c](https://github.com/ecomplus/procedures/commit/ed18f1c9b11f8bff2de914081680776a0d0b9e6d))

### [1.0.15](https://github.com/ecomplus/procedures/compare/v1.0.14...v1.0.15) (2020-10-23)


### Bug Fixes

* **order-status-map:** add 'unauthorized' to cancelled map ([50fc4ac](https://github.com/ecomplus/procedures/commit/50fc4ac0b106a5b5d2f0c15566fedf9035e2bbb2))

### [1.0.14](https://github.com/ecomplus/procedures/compare/v1.0.13...v1.0.14) (2020-10-17)

### [1.0.13](https://github.com/ecomplus/procedures/compare/v1.0.12...v1.0.13) (2020-10-17)

### [1.0.12](https://github.com/ecomplus/procedures/compare/v1.0.11...v1.0.12) (2020-10-17)

### [1.0.11](https://github.com/ecomplus/procedures/compare/v1.0.10...v1.0.11) (2020-10-17)


### Bug Fixes

* **update-product-quantity:** set zero if not a number, ensure resolved ([e45fc7b](https://github.com/ecomplus/procedures/commit/e45fc7b337d6aedc18d487ac68c5a868ee55ac31))

### [1.0.10](https://github.com/ecomplus/procedures/compare/v1.0.9...v1.0.10) (2020-10-16)


### Bug Fixes

* **webhook:** fix debugging promises pipes count ([3be16d0](https://github.com/ecomplus/procedures/commit/3be16d05d0ab961d8c01075aa6c3457825416393))

### [1.0.9](https://github.com/ecomplus/procedures/compare/v1.0.8...v1.0.9) (2020-10-16)

### [1.0.8](https://github.com/ecomplus/procedures/compare/v1.0.7...v1.0.8) (2020-10-16)


### Bug Fixes

* **promise-debug:** fix setting payload json (no format) ([52ffc2c](https://github.com/ecomplus/procedures/commit/52ffc2c66e6282444df296024c8e784bec238d8f))
* **remove-order-buyers:** fix remove buyer order endpoint ([f92e8b2](https://github.com/ecomplus/procedures/commit/f92e8b2793e60cc847c72a614d8aa22107443ae0))

### [1.0.7](https://github.com/ecomplus/procedures/compare/v1.0.6...v1.0.7) (2020-10-15)


### Bug Fixes

* **api-requests:** hardset timeouts for products read requests ([09342f7](https://github.com/ecomplus/procedures/commit/09342f73b22c641a33ac0375fee61e1986269fc8))
* **deps:** update @ecomplus/application-sdk to v11.0.0-sqlite.1.14.0 ([095347d](https://github.com/ecomplus/procedures/commit/095347dc6680c15b4e028bba0c8a6ad455228a56))

### [1.0.6](https://github.com/ecomplus/procedures/compare/v1.0.5...v1.0.6) (2020-10-07)


### Bug Fixes

* **server:** save current running requests by Store ID for delay ([c954767](https://github.com/ecomplus/procedures/commit/c954767e89c9b73f9afb28df0ffd366c545b215e))

### [1.0.5](https://github.com/ecomplus/procedures/compare/v1.0.4...v1.0.5) (2020-10-06)


### Bug Fixes

* **transaction-status:** no partial status for transactions ([a5e61a7](https://github.com/ecomplus/procedures/commit/a5e61a7ab09f0dcc0fc4e72b488eeec11d8334bf))

### [1.0.4](https://github.com/ecomplus/procedures/compare/v1.0.3...v1.0.4) (2020-10-01)


### Bug Fixes

* **order-items:** fix selecting items to delete/update on changes ([b5df78d](https://github.com/ecomplus/procedures/commit/b5df78d80b6a7e1c6f209488c5d50a4876ba2bf2))

### [1.0.3](https://github.com/ecomplus/procedures/compare/v1.0.2...v1.0.3) (2020-05-22)


### Bug Fixes

* **deps:** update to @ecomplus/application-sdk@sqlite ([a64abb5](https://github.com/ecomplus/procedures/commit/a64abb5290db938735057a104e3a65d6919731c2))

### [1.0.2](https://github.com/ecomplus/procedures/compare/v1.0.1...v1.0.2) (2020-05-06)


### Bug Fixes

* **order-status:** skip editing main status if cancelled by customer ([2e4f0ce](https://github.com/ecomplus/procedures/commit/2e4f0cee4951238619d85d909ec0d941f9048b6b))

### [1.0.1](https://github.com/ecomplus/procedures/compare/v1.0.0...v1.0.1) (2020-05-06)


### Bug Fixes

* **order-status:** prevent reopenning previously cancelled order ([c99ce0d](https://github.com/ecomplus/procedures/commit/c99ce0df8c9d084fc00923eb0b8ca63d3d0be1ea))
* **order-status:** prevent reopenning previously cancelled order (main) ([6649b57](https://github.com/ecomplus/procedures/commit/6649b570f5bb5f27d3ff5ef1a7d7f1c400fcd788))

## [1.0.0](https://github.com/ecomplus/procedures/compare/v0.3.11...v1.0.0) (2020-04-10)

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
