import {Transaction} from "../model";

export interface GetTransactionsParams {
    userSuppliedId?: string;
    transactionType?: Transaction.TransactionType;
}
