import { V0_SEARCH_TRANSACTIONS, V0_STATE_ABI, V0_STATE_ABI_BIN_TO_JSON, V0_STATE_PERMISSION_LINKS, V0_STATE_TABLE, V0_STATE_TABLES_ACCOUNTS, V0_STATE_TABLES_SCOPES, V1_AUTH_ISSUE } from "./endpoints";
import { RpcError, RpcStatusError } from "./rpcerror";
import { MultiStateResponse, SearchTransactionsResponse, StateAbiBinToJsonResponse, StateAbiResponse, StatePermissionLinksResponse, StateResponse } from "./types/api";
import { AuthIssue } from "./types/tables";

function queryParams(params: {[key: string]: any}) {
    const entries = [];
    for (const key of Object.keys(params)) {
        const value = params[key];
        if (value !== undefined) { entries.push(encodeURIComponent(key) + "=" + encodeURIComponent(value)); }
    }
    return entries.join("&");
}

export type Fetch = (url: string | Request, init?: RequestInit) => Promise<Response>;
declare const global: any;

/** Make RPC calls */
export class JsonRpc {
    public endpoint: string;
    public token: string = "";
    public fetchBuiltin: Fetch;

    /**
     * @param args
     *    * `fetch`:
     *    * browsers: leave `null` or `undefined`
     *    * node: provide an implementation
     */
    constructor(endpoint: string, args: { fetch?: Fetch, token?: string } = {}) {
        this.endpoint = endpoint;
        if (args.fetch) {
            this.fetchBuiltin = args.fetch;
        } else {
            this.fetchBuiltin = (global as any).fetch;
        }
        if (args.token) {
            this.token = args.token;
        }
    }

    /** POST `body` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    public async post<T>(path: string, body: any): Promise<T> {
        let response;
        let json;
        try {
            const f = this.fetchBuiltin;
            response = await f(this.endpoint + path, {
                body: JSON.stringify(body),
                headers: this.token ? {Authorization: `Bearer ${this.token}`} : {},
                method: "POST",
            });
            json = await response.json();
            if (json.processed && json.processed.except) {
                throw new RpcError(json);
            }
        } catch (e) {
            e.isFetchError = true;
            throw e;
        }
        if (!response.ok) {
            throw new RpcError(json);
        }
        return json;
    }

    /** GET `params` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    public async get<T>(path: string, params: any): Promise<T> {
        let response;
        let json;
        const url = this.endpoint + path + "?" + queryParams(params);
        if (!this.token) { throw new Error("dfuse.io API token is required"); }
        try {
            const f = this.fetchBuiltin;
            response = await f(url, {
                headers: this.token ? {Authorization: `Bearer ${this.token}`} : {},
                method: "GET",
            });

            if (response.status !== 200) {
                throw new RpcStatusError(response);
            }

            json = await response.json();
            if (json.processed && json.processed.except) {
                throw new RpcError(json);
            }
        } catch (e) {
            e.isFetchError = true;
            throw e;
        }
        if (!response.ok) {
            throw new RpcError(json);
        }
        return json;
    }

    /**
     * POST /v1/auth/issue
     *
     * Issues Dfuse API Key using a Server Token
     */
    public auth_issue(api_key: string) {
        return this.post<AuthIssue>(V1_AUTH_ISSUE, { api_key });
    }

    /**
     * GET /v0/search/transactions
     *
     * Search an EOSIO blockchain for transactions based on free-form criterias, using the simple dfuse Search query language.
     *
     * @param {string} q Search query string. See Search language (https://docs.dfuse.io/#ref-search-query-specs) specs for details.
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.start_block] Block number to start search (inclusive). Defaults to 0, which means Last Irreversible Block (tip of the chain).
     * @param {number} [options.sort] Defaults to ascending search. Use DESC to sort descending.
     * @param {number} [options.block_count] Number of blocks to search from start_block. Depending on sort order, the block_count will count upwards or downwards.
     * @param {number} [options.limit] Cap the number of returned results to limit. Defaults to 100.
     * @param {number} [options.cursor] If cursor is passed back (from a previous response)
     * @param {number} [options.with_reversible] If with_reversible is set to true actions included in blocks that are not yet irreversible will be included.
     */
    public search_transactions<T = unknown>(q: string, options: {
        start_block?: number
        sort?: string
        block_count?: string
        limit?: number
        cursor?: string
        with_reversible?: boolean,
    } = {}) {
        const params = {
            q,
            start_block: options.start_block,
            sort: options.sort,
            block_count: options.block_count,
            limit: options.limit,
            cursor: options.cursor,
            with_reversible: options.with_reversible,
        };
        return this.get<SearchTransactionsResponse<T>>(V0_SEARCH_TRANSACTIONS, params);
    }

    /**
     * GET /v0/state/abi
     *
     * Fetches the ABI for a given contract account, at any block height.
     *
     * @param {string} account Contract account targeted by the action.
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.block_num] The block number for which you want to retrieve the consistent table snapshot.
     * @param {boolean} [options.json=false] Decode each row from its binary form into JSON. If json: false, then hexadecimal representation of its binary data is returned instead.
     */
    public state_abi(account: string, options: {
        block_num?: number
        json?: boolean,
    } = {}) {
        const params = {
            account,
            block_num: options.block_num,
            json: options.json,
        };
        return this.get<StateAbiResponse>(V0_STATE_ABI, params);
    }

    /**
     * GET /v0/state/abi/bin_to_json
     *
     * Fetches the ABI for a given contract account, at any block height.
     *
     * @param {string} account Contract account targeted by the action.
     * @param {string} table The name-encoded table name you want to retrieve. For example, user balances for tokens live in the accounts table. Refer to the contract's ABI for a list of available tables. This is contract dependent.
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.block_num] The block number for which you want to retrieve the consistent table snapshot.
     * @param {string[]} [options.hex_rows] An array of hexadecimal rows to decode. Each row must be a valid hexadecimal string representation of the row to decode against the ABI.
     */
    public state_abi_bin_to_json(account: string, table: string, options: {
        block_num?: number
        hex_rows?: string[],
    } = {}) {
        const params = {
            account,
            table,
            block_num: options.block_num,
            hex_rows: options.hex_rows,
        };
        return this.post<StateAbiBinToJsonResponse>(V0_STATE_ABI_BIN_TO_JSON, params);
    }

    /**
     * GET /v0/state/permission_links
     *
     * Fetches snapshots of any account's linked authorizations on the blockchain, at any block height.
     *
     * @param {string} account Contract account targeted by the action.
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.block_num] The block number for which you want to retrieve the consistent table snapshot.
     */
    public state_permission_links(account: string, options: {
        block_num?: number,
    } = {}) {
        const params = {
            account,
            block_num: options.block_num,
        };
        return this.get<StatePermissionLinksResponse>(V0_STATE_PERMISSION_LINKS, params);
    }

    /**
     * GET /v0/state/table
     *
     * Fetches the state of any table, at any block height.
     *
     * @param {string} account Contract account targeted by the action.
     * @param {string} scope The name-encoded scope of the table you are requesting.
     * For example, user balances for tokens live in their account name's scope.
     * This is contract dependent, so inspect the ABI for the contract you are interested in.
     * @param {string} table The name-encoded table name you want to retrieve.
     * For example, user balances for tokens live in the accounts table.
     * Refer to the contract's ABI for a list of available tables.
     * This is contract dependent.
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.block_num] The block number for which you want to retrieve the consistent table snapshot.
     * @param {boolean} [options.json=false] Decode each row from its binary form into JSON. If json: false, then hexadecimal representation of its binary data is returned instead.
     * @param {string} [options.key_type="name"] How to represent the row keys in the returned table.
     * @param {boolean} [options.with_block_num] Will return one block_num with each row. Represents the block at which that row was last changed.
     * @param {boolean} [options.with_abi] Will return the ABI in effect at block block_num.
     */
    public state_table<T = unknown>(account: string, scope: string, table: string, options: {
        block_num?: number
        json?: boolean
        key_type?: string
        with_block_num?: boolean
        with_abi?: boolean,
    } = {}) {
        const params = {
            account,
            scope,
            table,
            block_num: options.block_num,
            json: options.json,
            key_type: options.key_type,
            with_block_num: options.with_block_num,
            with_abi: options.with_abi,
        };
        return this.get<StateResponse<T>>(V0_STATE_TABLE, params);
    }

    /**
     * GET /v0/state/tables/accounts
     *
     * Fetches a table for a given contract account for a group of scopes, at any block height.
     *
     * @param {string} accounts An AccountName list a maximum of 1500 elements can be present in the list.
     * @param {string[]} scope A Name list, a maximum of 1500 elements can be present in the list.
     * @param {string} table The name-encoded table name you want to retrieve.
     * For example, user balances for tokens live in the accounts table.
     * Refer to the contract's ABI for a list of available tables.
     * This is contract dependent.
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.block_num] The block number for which you want to retrieve the consistent table snapshot.
     * @param {boolean} [options.json=false] Decode each row from its binary form into JSON. If json: false, then hexadecimal representation of its binary data is returned instead.
     * @param {string} [options.key_type="name"] How to represent the row keys in the returned table.
     * @param {boolean} [options.with_block_num] Will return one block_num with each row. Represents the block at which that row was last changed.
     * @param {boolean} [options.with_abi] Will return the ABI in effect at block block_num.
     */
    public state_tables_accounts<T = unknown>(accounts: string[], scope: string, table: string, options: {
        block_num?: number
        json?: boolean
        key_type?: string
        with_block_num?: boolean
        with_abi?: boolean,
    } = {}) {
        const params = {
            accounts: accounts.join("|"),
            scope,
            table,
            block_num: options.block_num,
            json: options.json,
            key_type: options.key_type,
            with_block_num: options.with_block_num,
            with_abi: options.with_abi,
        };
        return this.get<MultiStateResponse<T>>(V0_STATE_TABLES_ACCOUNTS, params);
    }

    /**
     * GET /v0/state/tables/scopes
     *
     * Fetches a table for a given contract account for a group of scopes, at any block height.
     *
     * @param {string} account Contract account targeted by the action.
     * @param {string[]} scope A Name list, a maximum of 1500 elements can be present in the list.
     * @param {string} table The name-encoded table name you want to retrieve.
     * For example, user balances for tokens live in the accounts table.
     * Refer to the contract's ABI for a list of available tables.
     * This is contract dependent.
     * @param {object} [options={}] Optional parameters
     * @param {number} [options.block_num] The block number for which you want to retrieve the consistent table snapshot.
     * @param {boolean} [options.json=false] Decode each row from its binary form into JSON. If json: false, then hexadecimal representation of its binary data is returned instead.
     * @param {string} [options.key_type="name"] How to represent the row keys in the returned table.
     * @param {boolean} [options.with_block_num] Will return one block_num with each row. Represents the block at which that row was last changed.
     * @param {boolean} [options.with_abi] Will return the ABI in effect at block block_num.
     */
    public state_tables_scopes<T = unknown>(account: string, scopes: string[], table: string, options: {
        block_num?: number
        json?: boolean
        key_type?: string
        with_block_num?: boolean
        with_abi?: boolean,
    } = {}) {
        const params = {
            account,
            scopes: scopes.join("|"),
            table,
            block_num: options.block_num,
            json: options.json,
            key_type: options.key_type,
            with_block_num: options.with_block_num,
            with_abi: options.with_abi,
        };
        return this.get<MultiStateResponse<T>>(V0_STATE_TABLES_SCOPES, params);
    }
}
