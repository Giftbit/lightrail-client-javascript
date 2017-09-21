import {TransactionBreakdown} from "./TransactionBreakdown";

export interface Transaction {
    transactionId: string;
    value: number;
    userSuppliedId: string;
    dateCreated: string;
    transactionType: Transaction.TransactionType;
    transactionAccessMethod: Transaction.TransactionAccessMethod;
    parentTransactionId: string;
    cardId: string;
    currency: string;
    transactionBreakdown: TransactionBreakdown[];
    metadata: object;
}

export namespace Transaction {
    export type TransactionType = "DRAWDOWN" | "FUND" | "INITIAL_VALUE" | "CANCELLATION" | "INACTIVATE" | "ACTIVATE" | "FREEZE" | "UNFREEZE" | "PENDING_CREATE" | "PENDING_VOID" | "PENDING_CAPTURE" | "DRAWDOWN_REFUND";
    export namespace TransactionType {
        export const DRAWDOWN: TransactionType = "DRAWDOWN";
        export const FUND: TransactionType = "FUND";
        export const INITIAL_VALUE: TransactionType = "INITIAL_VALUE";
        export const CANCELLATION: TransactionType = "CANCELLATION";
        export const INACTIVATE: TransactionType = "INACTIVATE";
        export const ACTIVATE: TransactionType = "ACTIVATE";
        export const FREEZE: TransactionType = "FREEZE";
        export const UNFREEZE: TransactionType = "UNFREEZE";
        export const PENDING_CREATE: TransactionType = "PENDING_CREATE";
        export const PENDING_VOID: TransactionType = "PENDING_VOID";
        export const PENDING_CAPTURE: TransactionType = "PENDING_CAPTURE";
        export const DRAWDOWN_REFUND: TransactionType = "DRAWDOWN_REFUND";
    }

    export type TransactionAccessMethod = "CARDID" | "RAWCODE";
    export namespace TransactionAccessMethod {
        export const CARDID: TransactionAccessMethod = "CARDID";
        export const RAWCODE: TransactionAccessMethod = "RAWCODE";
    }
}
