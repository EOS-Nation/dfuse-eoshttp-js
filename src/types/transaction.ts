import { ActionTrace, Action } from "./action_trace"

export interface SearchTransactionsRow<T> {
    lifecycle:  TransactionLifecycle<T>;
    action_idx: number[];
}

export interface TransactionData<T> {
    lifecycle: TransactionLifecycle<T>
}

export interface TransactionLifecycle<T> {
    id: string
    transaction: Transaction<T>
    transaction_status: string
    execution_trace: TransactionTrace
    execution_block_header: BlockHeader
    dtrxops: DTrxOp<T>[]
    dbops: DBOp[]
    ramops?: RAMOp[]
    pub_keys: string[]
    created_by?: ExtDTrxOp<T>
    canceled_by?: ExtDTrxOp<T>
    execution_irreversible: boolean
    creation_irreversible: boolean
    cancelation_irreversible: boolean
}

export interface Transaction<T> {
    expiration: string
    ref_block_num: number
    ref_block_prefix: number
    max_net_usage_words: number
    max_cpu_usage_ms: number
    delay_sec: number
    context_free_actions: Array<Action<T>>
    actions: Array<Action<T>>
    transaction_extensions: any[]
    signatures?: string[]
    context_free_data?: Array<Action<T>>
}

export interface ExtDTrxOp<T> extends DTrxOp<T> {
    src_trx_id: string
    block_num: number
    block_id: string
    block_time: string
}

export interface DTrxOp<T> {
    op: string
    action_idx: number
    sender: string
    sender_id: string
    payer: string
    published_at: string
    delay_until: string
    expiration_at: string
    trx_id: string
    trx?: Transaction<T>
}

export interface DBOp {
    op: string
    action_idx: number
    account: string
    table: string
    scope: string
    old: DBRow
    new: DBRow
    key: string
}

export interface DBRow {
    key: string
    payer: string
    hex?: string
    json?: any
    error?: string
}

export interface RAMOp {
    op: string
    action_idx: number
    payer: string
    delta: number
    usage: number
}

export interface TransactionReceipt {
    status: string
    cpu_usage_us: number
    net_usage_words: number
}

export interface TransactionTrace {
    id: string
    block_num: number
    block_time: string
    producer_block_id: string
    receipt: TransactionReceipt
    elapsed: number
    net_usage: number
    scheduled: boolean
    action_traces: Array<ActionTrace<any>>
    failed_dtrx_trace: TransactionTrace
    except: any
}

export interface BlockHeader {
    timestamp: string
    producer: string
    confirmed: number
    previous: string
    transaction_mroot: string
    action_mroot: string
    schedule_version: number
    new_producers: null
    header_extensions: any[]
}