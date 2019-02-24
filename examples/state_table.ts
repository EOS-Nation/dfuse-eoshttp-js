import fetch from "isomorphic-fetch"
import { JsonRpc } from "../index";

const endpoint = process.env.DFUSE_IO_ENDPOINT || "https://mainnet.eos.dfuse.io"
const token = process.env.DFUSE_IO_API_KEY
const rpc = new JsonRpc(endpoint, { fetch, token })

rpc.state_table<{balance: string}>("eosio.token", "b1", "accounts", {block_num: 25000000, json: true}).then(response => {
    for (const row of response.rows) {
        console.log(row.json.balance)
    }
})
