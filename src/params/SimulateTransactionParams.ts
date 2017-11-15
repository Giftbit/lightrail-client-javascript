export interface SimulateTransactionParams {
    value: number;
    currency: string;
    metadata?: {[key: string]: any};
    nsf?: boolean;
    userSuppliedId: string;
}
