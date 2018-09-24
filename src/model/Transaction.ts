export type TransactionParty = LightrailTransactionParty | StripeTransactionParty | InternalTransactionParty;

export interface LightrailTransactionParty {
    rail: "lightrail";
    contactId?: string;
    code?: string;
    valueId?: string;
}

export interface StripeTransactionParty {
    rail: "stripe";
    source?: string;
    customer?: string;
    maxAmount?: number;
    priority?: number;
}

export interface InternalTransactionParty {
    rail: "internal";
    internalId: string;
    balance: number;
    pretax?: boolean;
    beforeLightrail?: boolean;
}

export type TransactionStep = LightrailTransactionStep | StripeTransactionStep | InternalTransactionStep;

export interface LightrailTransactionStep {
    rail: "lightrail";
    valueId: string;
    contactId?: string;
    code?: string;
    balanceBefore: number;
    balanceAfter: number;
    balanceChange: number;
}

export interface StripeTransactionStep {
    rail: "stripe";
    amount: number;
    chargeId?: string;
    charge?: any; // Stripe ICharge
}

export interface InternalTransactionStep {
    rail: "internal";
    internalId: string;
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

export interface LineItemBase {
    type?: "product" | "shipping" | "fee";
    productId?: string;
    variantId?: string;
    unitPrice?: number;
    quantity?: number;
    taxRate?: number;
    marketplaceRate?: number;
    tags?: string[];
    metadata?: object;
    lineTotal?: LineTotal;
}

export interface LineItem extends LineItemBase {
    lineTotal: LineTotal;
}

export interface TransactionTotals {
    subtotal?: number;
    tax?: number;
    discount?: number;
    discountLightrail?: number;
    paidLightrail?: number;
    paidStripe?: number;
    paidInternal?: number;
    payable?: number;
    remainder?: number;
}


export type TaxRoundingMode = "HALF_EVEN" | "HALF_UP";

export interface TaxRequestProperties {
    roundingMode: TaxRoundingMode;
}

export type TransactionType = "debit" | "credit" | "checkout" | "transfer" | string;

export interface Transaction {
    id: string;
    tax: TaxRequestProperties | null;
    transactionType: TransactionType;
    currency: string;
    createdDate: string;
    totals: TransactionTotals;
    lineItems: LineItem[];
    steps: TransactionStep[];
    paymentSources: TransactionParty[] | null;
    metadata: object | null;
    createdBy: string;
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