import * as lightrail from "./index";
import {LightrailRequestError} from "./LightrailRequestError";
import {formatFilterParams, formatResponse, isSuccessStatus, validateRequiredParams} from "./requestUtils";
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

/**
 * See: https://apidocs.lightrail.com/#operation/Checkout
 *
 * Example:
 * ```js
 * const checkoutTx = await Lightrail.transactions.checkout({
 *    id: "abcdefg",
 *    currency: "USD",
 *    lineItems: [
 *        {
 *            productId: "pedals",
 *            unitPrice: 100000,
 *            taxRate: 0
 *        }
 *    ],
 *    sources: [
 *        {
 *            rail: "lightrail",
 *            code: "PROMOCODE"
 *        },
 *        {
 *            rail: "stripe",
 *            source: "tok_visa"
 *        }
 *    ]
 * );
 * ```
 */
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

/**
 * See: https://apidocs.lightrail.com/#operation/Debit
 *
 * Example:
 * ```js
 * const debitTx = await Lightrail.transactions.debit({
 *    id: "abcdefg",
 *    currency: "USD",
 *    source: {
 *        rail: "lightrail",
 *        valueId: "hijklmnop"
 *    },
 *    amount: 1000
 * );
 * ```
 */
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

/**
 * See: https://apidocs.lightrail.com/#operation/Credit
 *
 * Example:
 * ```js
 * const creditTx = await Lightrail.transactions.credit({
 *    id: "abcdefg",
 *    currency: "USD",
 *    destination: {
 *        rail: "lightrail",
 *        valueId: "hijklmnop"
 *    },
 *    amount: 1000
 * );
 * ```
 */
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

/**
 * See: https://apidocs.lightrail.com/#operation/Transfer
 *
 * Example:
 * ```js
 * const transferTx = await Lightrail.transactions.transfer({
 *    id: "abcdefg",
 *    currency: "USD",
 *    source: {
 *        rail: "lightrail",
 *        valueId: "hijklmnop"
 *    },
 *    destination: {
 *        rail: "lightrail",
 *        valueId: "qrstuv"
 *    },
 *    amount: 1000
 * );
 * ```
 */
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

/**
 * See: https://apidocs.lightrail.com/#operation/Reverse
 *
 * Example:
 * ```js
 * const reverseTx = await Lightrail.transactions.reverse("hijklmnop" {
 *    id: "abcdefg"  // This is the ID of the reverse transaction created.
 * );
 * ```
 */
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

/**
 * See: https://apidocs.lightrail.com/#operation/CapturePending
 *
 * Example:
 * ```js
 * const captureTx = await Lightrail.transactions.capturePending("hijklmnop" {
 *    id: "abcdefg"  // This is the ID of the capture transaction created.
 * );
 * ```
 */
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

/**
 * See: https://apidocs.lightrail.com/#operation/VoidPending
 *
 * Example:
 * ```js
 * const voidTx = await Lightrail.transactions.voidPending("hijklmnop" {
 *    id: "abcdefg"  // This is the ID of the void transaction created.
 * );
 * ```
 */
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

/**
 * See: https://apidocs.lightrail.com/#operation/ListTransactions
 *
 * Example:
 * ```js
 * const transactions = await Lightrail.transactions.listTransactions();
 * const transactionsLimited = await Lightrail.transactions.listTransactions({limit: 5});
 * ```
 */
export async function listTransactions(params?: ListTransactionsParams): Promise<ListTransactionsResponse> {
    const resp = await lightrail.request("GET", "transactions").query(formatFilterParams(params));
    if (isSuccessStatus(resp.status)) {
        return formatResponse(resp);
    }
    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/GetaTransaction
 *
 * Example:
 * ```js
 * const transaction = await Lightrail.transactions.getTransaction("abcdefg");
 * ```
 */
export async function getTransaction(transaction: string | Transaction): Promise<GetTransactionResponse> {
    const transactionId = getTransactionId(transaction);

    const resp = await lightrail.request("GET", `transactions/${encodeURIComponent(transactionId)}`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * See: https://apidocs.lightrail.com/#operation/GetTransactionChain
 *
 * Example:
 * ```js
 * const transactions = await Lightrail.transactions.getTransactionChain("abcdefg");
 * ```
 */
export async function getTransactionChain(transaction: string | Transaction): Promise<GetTransactionChainResponse> {
    const transactionId = getTransactionId(transaction);

    const resp = await lightrail.request("GET", `transactions/${encodeURIComponent(transactionId)}/chain`);
    if (isSuccessStatus(resp.status) || resp.status === 404) {
        return formatResponse(resp);
    }

    throw new LightrailRequestError(resp);
}

/**
 * @internal
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
