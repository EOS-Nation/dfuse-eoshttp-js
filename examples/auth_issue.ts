import { JsonRpc } from "../index";
import fetch from "isomorphic-fetch"

const endpoint = "https://mainnet.eos.dfuse.io"
const token = "<Paste your API token here>"
const rpc = new JsonRpc(endpoint, { fetch, token })

rpc.auth_issue("<Paste your Server API token here>").then(response => {
    console.log(response.token, response.expires_at)
})