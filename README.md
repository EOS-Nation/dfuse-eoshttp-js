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

rpc.auth_issue("<Paste your Server API token here>").then(response => {
    console.log(response.token, response.expires_at)
})
```

## API
