import fetch from "isomorphic-fetch"
import { JsonRpc } from "../index";

const endpoint = process.env.DFUSE_IO_ENDPOINT || "https://mainnet.eos.dfuse.io"
const token = process.env.TOKEN || "";
const rpc = new JsonRpc(endpoint, { fetch, token })

rpc.state_abi_bin_to_json('eosio.token', 'accounts', { block_num: 2500000, "hex_rows":["aa2c0b010000000004454f5300000000"] }).then(response => {
    console.log(response)
})