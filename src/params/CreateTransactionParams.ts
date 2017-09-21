export interface CreateTransactionParams {
    value: number;
    currency: string;
    metadata?: object;
    pending?: boolean;
    userSuppliedId: string;
}
