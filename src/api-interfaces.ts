export interface StateTable<T> {
    last_irreversible_block_id: string;
    last_irreversible_block_num: number;
    rows: StateTableRow<T>[];
}

export interface StateTableRow<T> {
    key: string;
    payer: string;
    json: T;
}

export interface StateTableScopes<T> {
    last_irreversible_block_id: string;
    last_irreversible_block_num: number;
    tables: TableScopes<T>[];
}

export interface TableScopes<T> {
    account: string;
    scope: string;
    rows: TableScopesRow<T>[];
}

export interface TableScopesRow<T> {
    key: string;
    payer: string;
    json: T;
}

export interface AuthIssue {
    token: string;
    expires_at: number;
}