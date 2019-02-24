# dfuse.io HTTP API Javascript library

## Installation

Using Yarn:

```
yarn add dfuse-eoshttp-js
```

or using NPM:

```
npm install --save dfuse-eoshttp-js
```

## Quick Start

```js
const { JsonRpc } = require("dfuse-eoshttp-js")
const fetch = require("isomorphic-fetch")

const endpoint = "https://mainnet.eos.dfuse.io"
const token = "<Paste your API token here>"
const rpc = new JsonRpc(endpoint, { fetch, token })
```

## ENV Variables

```
DFUSE_IO_ENDPOINT=<Enter Dfuse Endpoint>  # "https://mainnet.eos.dfuse.io"
DFUSE_IO_SERVER_API_KEY=<Paste your API token here>  # Get key at dfuse.io
```

## API

### GET /v0/search/transactions

> Search an EOSIO blockchain for transactions based on free-form criterias, using the simple dfuse Search query language.

```js
const searchQuery = 'receiver:eosio.token action:transfer data.to:eoscafeblock'

rpc.search_transactions(searchQuery, { limit: 1 }).then(response => {
    console.log(response)
})
```

### GET /v0/state/abi

> Fetches the ABI for a given contract account, at any block height.

```js
rpc.state_abi('eosio', { block_num: 128, json: true }).then(response => {
    console.log(response)
})
```

### GET /v0/state/abi/bin_to_json

> Fetches the ABI for a given contract account, at any block height.

```js
rpc.state_abi_bin_to_json('eosio.token', 'accounts', { block_num: 2500000, "hex_rows":["aa2c0b010000000004454f5300000000"] }).then(response => {
    console.log(response)
})
```

### GET /v0/state/permission_links

> Fetches snapshots of any account's linked authorizations on the blockchain, at any block height.

```js
rpc.state_permission_links('eoscanadacom', { block_num: 10000000 }).then(response => {
    console.log(response)
})
```

### GET /v0/state/table

> Fetches the state of any table, at any block height.

```js
rpc.state_table("eosio.token", "b1", "accounts", {json: true}).then(response => {
    for (const row of response.rows) {
        console.log(row.json.balance)
        //=> 12.2873 EOS
    }
})
```

### GET /v0/state/tables/accounts

> Fetches a table for a given contract account for a group of scopes, at any block height.

```js
rpc.state_tables_accounts<{balance: string}>(["eosio.token", "eosadddddddd", "tokenbyeocat"], "b1", "accounts", {block_num: 25000000, json: true}).then(response => {
    console.dir(response, { depth: null })
})
```

### GET /v0/state/tables/scopes

> Fetches a table for a given contract account for a group of scopes, at any block height.

```js
rpc.state_tables_scopes("eosio.token", ["b1", "eosio.null"], "accounts", {json: true}).then(response => {
    for (const table of response.tables) {
        for (const row of table.rows) {
            console.log(row.json.balance)
            //=> 12.2873 EOS
            //=> 0.0084 EOS
        }
    }
})
```
### POST /v1/auth/issue

> Issues Dfuse API Key using a Server Token

```js
rpc.auth_issue(server_token).then(response => {
    console.log(response)
})
```