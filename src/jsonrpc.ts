import { AuthIssue, StateTable, StateTableScopes } from './api-interfaces';
import { RpcError } from './rpcerror';

export type Fetch = (url: string | Request, init?: RequestInit) => Promise<Response>;

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

    /** Post `body` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    public async fetch(path: string, body: any) {
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

    /** Raw call to `/v1/auth/issue` */
    public async auth_issue(api_key: string): Promise<AuthIssue> {
        return await this.fetch('/v1/auth/issue', { api_key });
    }

    /** Raw call to `/v0/state/table` */
    public async state_table<T>(code: string, scope: string, table: string, block_num: number): Promise<StateTable<T>> {
        const params = {
            account: code,
            table,
            scope,
            block_num,
            json: true
        }
        return await this.fetch('/v0/state/table', params);
    }

    /** Raw call to `/v0/state/tables/scopes` */
    public async state_tables_scopes<T>(code: string, scopes: string[], table: string, block_num: number): Promise<StateTableScopes<T>> {
        const params = {
            account: code,
            table,
            scopes: scopes.join('|'),
            block_num,
            json: true
        }
        return await this.fetch('/v0/state/tables/scopes', params);
    }
}
