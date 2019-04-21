import fetch from "isomorphic-fetch";
import { JsonRpc } from "../index";

const endpoint = process.env.DFUSE_IO_ENDPOINT || "https://mainnet.eos.dfuse.io";
if (!process.env.DFUSE_IO_SERVER_API_KEY) { throw new Error("[DFUSE_IO_SERVER_API_KEY] is required"); }
const server_token = process.env.DFUSE_IO_SERVER_API_KEY;

const rpc = new JsonRpc(endpoint, { fetch });
rpc.auth_issue(server_token).then((response) => {
    console.log(response);
});
