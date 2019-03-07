import fetch from "isomorphic-fetch";
import { JsonRpc } from "../index";

const endpoint = process.env.DFUSE_IO_ENDPOINT || "https://mainnet.eos.dfuse.io";
const token = process.env.DFUSE_IO_API_KEY;
const rpc = new JsonRpc(endpoint, { fetch, token });

rpc.state_permission_links("eoscanadacom", { block_num: 10000000 }).then((response) => {
    console.log(response);
});
