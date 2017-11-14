export interface SimulateTransactionParams {
    value: number;
    currency: string;
    metadata?: object;
    nsf?: boolean;
    userSuppliedId: string;
}
