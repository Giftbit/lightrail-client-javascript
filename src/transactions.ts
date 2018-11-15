// CREATE
import * as lightrail from "./index";
import {LightrailRequestError} from "./LightrailRequestError";
import {formatResponse, isSuccessStatus, validateRequiredParams} from "./requestUtils";
import {
    CheckoutParams,
    CheckoutResponse,
    CreditParams,
    CreditResponse,
    DebitParams,
    DebitResponse,
    GetTransactionResponse,
    TransferParams,
    TransferResponse
} from "./params";
import {Transaction} from "./model";
import {ListTransactionsParams, ListTransactionsResponse} from "./params/transactions/ListTransactionsParams";


// CREATE
export async function checkout(params: CheckoutParams): Promise<CheckoutResponse> {
    if (!params) {
        throw new Error("checkout params not set");
    } else {
        validateRequiredParams(["id", "currency"], params);
    }

    const resp = await lightrail.request("POST", "transactions/checkout").send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

export async function debit(params: DebitParams): Promise<DebitResponse> {
    if (!params) {
        throw new Error("debit params not set");
    } else {
        validateRequiredParams(["id", "currency", "source", "amount"], params);
    }

    const resp = await lightrail.request("POST", "transactions/debit").send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

export async function credit(params: CreditParams): Promise<CreditResponse> {
    if (!params) {
        throw new Error("credit params not set");
    } else {
        validateRequiredParams(["id", "currency", "destination", "amount"], params);
    }

    const resp = await lightrail.request("POST", "transactions/credit").send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

export async function transfer(params: TransferParams): Promise<TransferResponse> {
    if (!params) {
        throw new Error("transfer params not set");
    } else {
        validateRequiredParams(["id", "currency", "source", "destination", "amount"], params);
    }

    const resp = await lightrail.request("POST", "transactions/transfer").send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

// READ
export async function listTransactions(params?: ListTransactionsParams): Promise<ListTransactionsResponse> {
    const resp = await lightrail.request("GET", "transactions").query(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

export async function getTransaction(transaction: string | Transaction): Promise<GetTransactionResponse> {
    const transactionId = getTransactionId(transaction);

    const resp = await lightrail.request("GET", `transactions/${encodeURIComponent(transactionId)}`);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}


///////////////////
/**
 * Get transactionId from the string (as the ID itself) or Transaction object.
 */
export function getTransactionId(transaction: string | Transaction): string {
    if (!transaction) {
        throw new Error("transaction not set");
    } else if (typeof transaction === "string") {
        return transaction;
    } else if (transaction.id) {
        return transaction.id;
    } else {
        throw new Error("transaction must be a string for transactionId or a Transaction object");
    }
}