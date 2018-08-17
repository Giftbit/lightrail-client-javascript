export interface PaymentSource {
    rail: string;

    [key: string]: string;
}

export interface TransactionStep {
    rail: string;

    [key: string]: object | string | number;
}

export interface LightrailTransactionStep {
    rail: string;
    valueId: string;
    contactId: string;
    code: string;
    balanceBefore: number;
    balanceAfter: number;
    balanceChange: number;
}

export interface LineTotal {
    subtotal: number;
    taxable: number;
    tax: number;
    discount: number;
    remainder: number;
    payable: number;
}

export interface LineItem {
    productId: string;
    unitPrice: number;
    quantity: number;
    taxRate: number;
    lineTotal: LineTotal;
}

export interface TransactionTotals {
    subtotal?: number;
    tax?: number;
    discount?: number;
    payable?: number;
    remainder?: number;
}

export type TransactionType = "debit" | "credit" | "checkout" | "transfer";

export interface Transaction {
    id: string;
    transactionType: TransactionType;
    currency: string;
    createdDate: string;
    totals: TransactionTotals;
    lineItems: LineItem[];
    steps: Array<LightrailTransactionStep | TransactionStep>;
    paymentSources: PaymentSource[];
    metadata: object;
}