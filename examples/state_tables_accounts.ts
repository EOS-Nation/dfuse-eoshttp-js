import fetch from "isomorphic-fetch"
import { JsonRpc } from "../index";

const endpoint = process.env.DFUSE_IO_ENDPOINT || "https://mainnet.eos.dfuse.io"
const token = process.env.TOKEN || "";

const rpc = new JsonRpc(endpoint, { fetch, token })

rpc.state_tables_accounts<{balance: string}>(["eosio.token", "eosadddddddd", "tokenbyeocat"], "b1", "accounts", {block_num: 25000000, json: true}).then(response => {
    console.dir(response, { depth: null })
})