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

```
const { Api } = require("@dfuse/eoshttp-js")
const fetch = require("isomorphic-fetch")

const endpoint = "mainnet.eos.dfuse.io"
const token = "<Paste your API token here>"
const api = new Api({ endpoint, token, fetch })
```

## API

