import * as lightrail from "./";
import * as cardTransactions from "./cardTransactions";
import {LightrailRequestError} from "./LightrailRequestError";
import {
    CapturePendingTransactionParams, CreateTransactionParams, GetTransactionsParams,
    PaginationParams, VoidPendingTransactionParams
} from "./params";
import {Pagination, Transaction} from "./model";

export async function createTransaction(fullcode: string, pin: string, params: CreateTransactionParams): Promise<Transaction> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const resp = await lightrail.request("POST", `codes/${encodeURIComponent(fullcode)}/transactions`)
        .query({
            pin: pin || undefined
        })
        .send(params);
    if (resp.status === 200) {
        return resp.body.transaction;
    }
    throw new LightrailRequestError(resp);
}

export async function getTransaction(fullcode: string, pin: string, transaction: string | Transaction): Promise<Transaction> {
    const transactionId = cardTransactions.getTransactionId(transaction);
    const resp = await lightrail.request("GET", `codes/${encodeURIComponent(fullcode)}/transactions/${encodeURIComponent(transactionId)}`)
        .query({
            pin: pin || undefined
        });
    if (resp.status === 200) {
        return resp.body.transaction;
    }
    throw new LightrailRequestError(resp);
}

export async function getTransactions(fullcode: string, pin: string, params: GetTransactionsParams | PaginationParams): Promise<{ transactions: Transaction[], pagination: Pagination }> {
    const resp = await lightrail.request("GET", `codes/${encodeURIComponent(fullcode)}/transactions`)
        .query({
            ...params,
            pin: pin || undefined
        });
    if (resp.status === 200) {
        return resp.body;
    }
    throw new LightrailRequestError(resp);
}

export async function getTransactionByUserSuppliedId(fullcode: string, pin: string, userSuppliedId: string): Promise<Transaction> {
    const resp = await getTransactions(fullcode, pin, {userSuppliedId});
    if (resp.transactions.length > 0) {
        return resp.transactions[0];
    }
    return null;
}

export async function capturePending(fullcode: string, pin: string, transaction: string | Transaction, params: CapturePendingTransactionParams): Promise<Transaction> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const transactionId = cardTransactions.getTransactionId(transaction);
    const resp = await lightrail.request("POST", `codes/${encodeURIComponent(fullcode)}/transactions/${encodeURIComponent(transactionId)}/capture`)
        .query({
            pin: pin || undefined
        })
        .send(params);
    if (resp.status === 200) {
        return resp.body.transaction;
    }
    throw new LightrailRequestError(resp);
}

export async function voidPending(fullcode: string, pin: string, transaction: string | Transaction, params: VoidPendingTransactionParams): Promise<Transaction> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const transactionId = cardTransactions.getTransactionId(transaction);
    const resp = await lightrail.request("POST", `codes/${encodeURIComponent(fullcode)}/transactions/${encodeURIComponent(transactionId)}/void`)
        .query({
            pin: pin || undefined
        })
        .send(params);
    if (resp.status === 200) {
        return resp.body.transaction;
    }
    throw new LightrailRequestError(resp);
}
