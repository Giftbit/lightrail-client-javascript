import * as lightrail from "./index";
import {LightrailRequestError} from "./LightrailRequestError";
import {formatResponse, isSuccessStatus, validateRequiredParams} from "./requestUtils";
import {
    CapturePendingParams,
    CapturePendingResponse,
    CheckoutParams,
    CheckoutResponse,
    CreditParams,
    CreditResponse,
    DebitParams,
    DebitResponse,
    GetTransactionChainResponse,
    GetTransactionResponse,
    ListTransactionsParams,
    ListTransactionsResponse,
    ReverseParams,
    ReverseResponse,
    TransferParams,
    TransferResponse,
    VoidPendingParams,
    VoidPendingResponse
} from "./params";
import {Transaction} from "./model";

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
        validateRequiredParams(["id", "currency", "source"], params);
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
        validateRequiredParams(["id", "currency", "destination"], params);
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

export async function reverse(transactionToReverse: string | Transaction, params: ReverseParams): Promise<ReverseResponse> {
    if (!params) {
        throw new Error("reverse params not set");
    } else {
        validateRequiredParams(["id"], params);
    }

    const resp = await lightrail.request("POST", `transactions/${encodeURIComponent(getTransactionId(transactionToReverse))}/reverse`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

export async function capturePending(transactionToCapture: string | Transaction, params: CapturePendingParams): Promise<CapturePendingResponse> {
    if (!params) {
        throw new Error("capture params not set");
    } else {
        validateRequiredParams(["id"], params);
    }

    const resp = await lightrail.request("POST", `transactions/${encodeURIComponent(getTransactionId(transactionToCapture))}/capture`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

export async function voidPending(transactionToVoid: string | Transaction, params: VoidPendingParams): Promise<VoidPendingResponse> {
    if (!params) {
        throw new Error("void params not set");
    } else {
        validateRequiredParams(["id"], params);
    }

    const resp = await lightrail.request("POST", `transactions/${encodeURIComponent(getTransactionId(transactionToVoid))}/void`).send(params);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

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

export async function getTransactionChain(transaction: string | Transaction): Promise<GetTransactionChainResponse> {
    const transactionId = getTransactionId(transaction);

    const resp = await lightrail.request("GET", `transactions/${encodeURIComponent(transactionId)}/chain`);
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

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
