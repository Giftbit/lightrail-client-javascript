export interface CreateTransactionParams {
    value: number;
    currency: string;
    metadata?: {[key: string]: any};
    pending?: boolean;
    userSuppliedId: string;
}
