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

export interface DebitSource {
    rail: "lightrail";
    code?: string;
    contactId?: string;
    valueId?: string;
}

export interface TransferSource extends DebitSource {
    source?: string;
    customer?: string;
    maxAmount?: number;
}

export interface CheckoutSource {
    rail: "lightrail" | "stripe" | "internal";
    code?: string;
    contactId?: string;
    valueId?: string;
    source?: string;
    customer?: string;
    maxAmount?: number;
    id?: string;
    balance?: number;
    beforeLightrail?: boolean;
}

export interface TransactionDestination {
    rail: "lightrail";
    code?: string;
    contactId?: string;
    valueId?: string;
}