# dfuse.io HTTP API Javascript library

## Installation

Using Yarn:

```
yarn add @dfuse/eoshttp-js
```

or using NPM:

```
npm install --save @dfuse/eoshttp-js
```

## Quick Start

```js
const { JsonRpc } = require("@dfuse/eoshttp-js")
const fetch = require("isomorphic-fetch")

const endpoint = "https://mainnet.eos.dfuse.io"
const token = "<Paste your API token here>"
const rpc = new JsonRpc(endpoint, { fetch, token })
```

## API

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
