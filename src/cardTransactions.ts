import * as lightrail from "./";
import * as cards from "./cards";
import {Card} from "./model/Card";
import {CreateTransactionParams} from "./params/CreateTransactionParams";
import {Transaction} from "./model/Transaction";
import {LightrailRequestError} from "./LightrailRequestError";
import {CapturePendingTransactionParams} from "./params/CapturePendingTransactionParams";
import {VoidPendingTransactionParams} from "./params/VoidPendingTransactionParams";
import {PaginationParams} from "./params/PaginationParams";
import {Pagination} from "./model/Pagination";
import {GetTransactionsParams} from "./params/GetTransactionsParams";
import {SimulateTransactionParams} from "./params/SimulateTransactionParams";

export async function createTransaction(card: string | Card, params: CreateTransactionParams): Promise<Transaction> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const cardId = cards.getCardId(card);
    const resp = await lightrail.request("POST", `cards/${encodeURIComponent(cardId)}/transactions`).send(params);
    if (resp.status === 200) {
        return resp.body.transaction;
    }
    throw new LightrailRequestError(resp);
}

export async function simulateTransaction(card: string | Card, params: SimulateTransactionParams): Promise<Transaction> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const cardId = cards.getCardId(card);
    const resp = await lightrail.request("POST", `cards/${encodeURIComponent(cardId)}/transactions/dryRun`).send(params);
    if (resp.status === 200) {
        return resp.body.transaction;
    }
    throw new LightrailRequestError(resp);
}

export async function getTransaction(card: string | Card, transaction: string | Transaction): Promise<Transaction> {
    const cardId = cards.getCardId(card);
    const transactionId = getTransactionId(transaction);
    const resp = await lightrail.request("GET", `cards/${encodeURIComponent(cardId)}/transactions/${encodeURIComponent(transactionId)}`);
    if (resp.status === 200) {
        return resp.body.transaction;
    }
    throw new LightrailRequestError(resp);
}

export async function getTransactions(card: string | Card, params: GetTransactionsParams & PaginationParams): Promise<{ transactions: Transaction[], pagination: Pagination }> {
    const cardId = cards.getCardId(card);
    const resp = await lightrail.request("GET", `cards/${encodeURIComponent(cardId)}/transactions`).query(params);
    if (resp.status === 200) {
        return resp.body;
    }
    throw new LightrailRequestError(resp);
}

export async function getTransactionByUserSuppliedId(card: string | Card, userSuppliedId: string): Promise<Transaction> {
    const resp = await getTransactions(card, {userSuppliedId});
    if (resp.transactions.length > 0) {
        return resp.transactions[0];
    }
    return null;
}

export async function capturePending(card: string | Card, transaction: string | Transaction, params: CapturePendingTransactionParams): Promise<Transaction> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const cardId = cards.getCardId(card);
    const transactionId = getTransactionId(transaction);
    const resp = await lightrail.request("POST", `cards/${encodeURIComponent(cardId)}/transactions/${encodeURIComponent(transactionId)}/capture`).send(params);
    if (resp.status === 200) {
        return resp.body.transaction;
    }
    throw new LightrailRequestError(resp);
}

export async function voidPending(card: string | Card, transaction: string | Transaction, params: VoidPendingTransactionParams): Promise<Transaction> {
    if (!params) {
        throw new Error("params not set");
    } else if (!params.userSuppliedId) {
        throw new Error("params.userSuppliedId not set");
    }

    const cardId = cards.getCardId(card);
    const transactionId = getTransactionId(transaction);
    const resp = await lightrail.request("POST", `cards/${encodeURIComponent(cardId)}/transactions/${encodeURIComponent(transactionId)}/void`).send(params);
    if (resp.status === 200) {
        return resp.body.transaction;
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
    } else if (transaction.transactionId) {
        return transaction.transactionId;
    } else {
        throw new Error("transaction must be a string for transactionId or a Transaction object");
    }
}
