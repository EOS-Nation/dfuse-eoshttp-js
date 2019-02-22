import fetch from "isomorphic-fetch"
import { JsonRpc } from "../index";

const endpoint = "https://mainnet.eos.dfuse.io"
const server_token = process.env.DFUSE_IO_SERVER_API_KEY || "";
const rpc = new JsonRpc(endpoint, { fetch })

rpc.auth_issue(server_token).then(response => {
    console.log(response)
})