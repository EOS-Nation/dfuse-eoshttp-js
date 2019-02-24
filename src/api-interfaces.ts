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


/**
 * SEARCH TRANSACTIONS
 */
export interface SearchTransactionsResponse<T> {
    cursor?:              string;
    transactions:         SearchTransactionsRow[];
    forked_head_warning?: boolean;
}

export interface SearchTransactionsRow {
    lifecycle:  TransactionLifecycle;
    action_idx: number[];
}

export interface TransactionLifecycle {
    id:                        string;
    transaction_status:        string;
    transaction:               Transaction;
    execution_trace?:          TransactionTrace;
    execution_block_header?:   BlockHeader;
    dtrxops?:                  DTrxOp[] | null;
    ramops?:                   RAMOp[] | null;
    dbops?:                    DbOp[] | null;
    pub_keys?:                 string[];
    created_by?:               ExtDTrxOp;
    canceled_by?:              ExtDTrxOp;
    execution_irreversible?:   boolean;
    creation_irreversible?:    boolean;
    cancelation_irreversible?: boolean;
}

export interface Transaction {
    expiration:             Date;
    ref_block_num:          number;
    ref_block_prefix:       number;
    max_net_usage_words:    number;
    max_cpu_usage_ms:       number;
    delay_sec:              number;
    context_free_actions:   any[];
    actions:                Action[];
    transaction_extensions: any[];
    signatures:             string[];
    context_free_data:      any[];
}

export interface TransactionTrace {
    id:                string | null;
    block_num:         number;
    block_time:        Date;
    producer_block_id: string;
    receipt:           Receipt;
    elapsed:           number;
    net_usage:         number;
    scheduled:         boolean;
    action_traces:     ActionTrace[];
    failed_dtrx_trace: TransactionTrace;
    except:            any;
}

export interface BlockHeader {
    timestamp:         Date;
    producer:          string;
    confirmed:         number;
    previous:          string;
    transaction_mroot: string;
    action_mroot:      string;
    schedule_version:  number;
    new_producers:     null;
    header_extensions: any[];
}

export interface DTrxOp {
    op:            string;
    action_idx:    number;
    sender:        string;
    sender_id:     string;
    payer:         string;
    published_at:  string;
    delay_until:   string;
    expiration_at: string;
    trx_id:        string;
    trx:           Transaction | null;
}

export interface ExtDTrxOp {
    src_trx_id:  string;
    block_num:   number;
    block_id:    string;
    block_time:  Date;
    dtrxOp:      DTrxOp
}

export interface RAMOp {
    op:         string;
    action_idx: number;
    payer:      string;
    delta:      number;
    usage:      number;
}

export interface DbOp {
    op:         string;
    action_idx: number;
    account:    string;
    table:      string;
    scope:      string;
    key:        string;
    old:        DbRow;
    new:        DbRow;
}

export interface DbRow {
    payer:  string;
    hex?:   string;
    json?:  object;
    error?: string;
}

export interface ActionTrace {
    receipt:            Receipt;
    act:                Action;
    context_free:       boolean;
    elapsed:            number;
    console:            string;
    trx_id:             string;
    block_num:          number;
    block_time:         Date;
    producer_block_id:  string;
    account_ram_deltas: AccountRAMDelta[] | null;
    except:             null;
    inline_traces:      InlineTrace[];
}

export interface AccountRAMDelta {
    account: string;
    delta:   number;
}

export interface Action {
    account:       string;
    name:          string;
    authorization: Authorization[];
    data?:         any;
    hex_data:      string;
}

export interface Authorization {
    actor:      string;
    permission: string;
}


export interface InlineTrace {
    receipt:            Receipt;
    act:                Action;
    context_free:       boolean;
    elapsed:            number;
    console:            string;
    trx_id:             string;
    block_num:          number;
    block_time:         Date;
    producer_block_id:  string;
    account_ram_deltas: AccountRAMDelta[] | null;
    except:             null;
    inline_traces:      InlineTrace[] | null;
}

export interface Receipt {
    receiver:        string;
    act_digest:      string;
    global_sequence: string;
    auth_sequence:   Array<Array<string | number>>;
    recv_sequence:   number;
    code_sequence:   number;
    abi_sequence:    number;
    status:          string;
    cpu_usage_us:    number;
    net_usage_words: number;
}