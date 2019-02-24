export interface StateTableRow<T> {
    key: string;
    payer: string;
    json: T;
}

export interface TableScopes<T> {
    account: string;
    scope: string;
    rows: Array<TableScopesRow<T>>;
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
