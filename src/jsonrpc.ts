import { AuthIssue, StateTable, StateTableScopes } from './api-interfaces';
import { RpcError } from './rpcerror';
import { queryParams } from "./utils";

export type Fetch = (url: string | Request, init?: RequestInit) => Promise<Response>;
declare const global: any

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
    public async fetch<T>(path: string, body: any): Promise<T> {
        let response;
        let json;
        try {
            const f = this.fetchBuiltin;
            response = await f(this.endpoint + path, {
                body: JSON.stringify(body),
                method: 'POST',
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

    /** POST `body` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    public async post<T>(path: string, body: any): Promise<T> {
        return this.fetch(path, body);
    }

    /** GET `params` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    public async get<T>(path: string, params: any): Promise<T> {
        let response;
        let json;
        const url = this.endpoint + path + "?" + queryParams(params);
        if (!this.token) throw new Error("dfuse.io API token is required")
        try {
            const f = this.fetchBuiltin;
            response = await f(url, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
                method: 'GET',
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

    /** Raw call to `/v1/auth/issue` */
    public async auth_issue(api_key: string): Promise<AuthIssue> {
        return await this.post('/v1/auth/issue', { api_key });
    }

    /** Raw call to `/v0/state/table` */
    public async state_table<T>(account: string, scope: string, table: string, block_num: number) {
        const params = {
            account,
            scope,
            table,
            block_num,
            json: true
        }
        return await this.get<StateTable<T>>('/v0/state/table', params);
    }

    /** Raw call to `/v0/state/tables/scopes` */
    public async state_tables_scopes<T>(account: string, scopes: string[], table: string, block_num: number) {
        const params = {
            account,
            scopes: scopes.join('|'),
            table,
            block_num,
            json: true
        }
        return await this.get<StateTableScopes<T>>('/v0/state/tables/scopes', params);
    }
}
