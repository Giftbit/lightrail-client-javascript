import {Transaction} from "../model/Transaction";

export interface GetTransactionsParams {
    userSuppliedId?: string;
    transactionType?: Transaction.TransactionType;
}
