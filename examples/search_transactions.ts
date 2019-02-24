import fetch from "isomorphic-fetch"
import { JsonRpc } from "../index";

const endpoint = process.env.DFUSE_IO_ENDPOINT || "https://mainnet.eos.dfuse.io"
const token = process.env.TOKEN || "";
const rpc = new JsonRpc(endpoint, { fetch, token })

const searchQuery = 'receiver:eosio.token action:transfer data.to:eoscafeblock'

rpc.search_transactions(searchQuery, { limit: 1 }).then(response => {
    console.log(response)
})