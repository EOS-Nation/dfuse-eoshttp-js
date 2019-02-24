import fetch from "isomorphic-fetch";
import { JsonRpc } from "../";

const endpoint = process.env.DFUSE_IO_ENDPOINT || "";
const token = process.env.DFUSE_IO_API_KEY;
const rpc = new JsonRpc(endpoint, { fetch, token });

test("jsonrpc.search_transactions", async () => {
    const searchQuery = "receiver:eosio.token action:transfer data.to:eoscafeblock";
    const response = await rpc.search_transactions(searchQuery, { limit: 1 });
    expect(!!response).toBeTruthy();
});

test("jsonrpc.state_abi", async () => {
    const response = await rpc.state_abi("eosio", { block_num: 128, json: true });
    expect(!!response).toBeTruthy();
});

test("jsonrpc.state_abi_bin_to_json", async () => {
    const options =  { block_num: 2500000, hex_rows: ["aa2c0b010000000004454f5300000000"] };
    const response = await rpc.state_abi_bin_to_json("eosio.token", "accounts", options);
    expect(!!response).toBeTruthy();
});

test("jsonrpc.state_permission_links", async () => {
    const response = await rpc.state_permission_links("eoscanadacom", { block_num: 10000000 });
    expect(!!response).toBeTruthy();
});

test("jsonrpc.state_table", async () => {
    const response = await rpc.state_table("eosio.token", "b1", "accounts", {json: true});
    expect(!!response).toBeTruthy();
});
