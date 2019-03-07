import fetch from "isomorphic-fetch";
import { JsonRpc } from "../index";

const endpoint = process.env.DFUSE_IO_ENDPOINT || "https://mainnet.eos.dfuse.io";
const token = process.env.DFUSE_IO_API_KEY;
const rpc = new JsonRpc(endpoint, { fetch, token });

rpc.state_tables_scopes<{balance: string}>("eosio.token", ["b1", "eosio.null"], "accounts", {block_num: 25000000, json: true}).then((response) => {
    for (const table of response.tables) {
        for (const row of table.rows) {
            console.log(row.json.balance);
        }
    }
});
