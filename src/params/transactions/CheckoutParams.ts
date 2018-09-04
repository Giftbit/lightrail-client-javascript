import {LightrailResponse} from "../LightrailResponse";
import {CheckoutSource, Transaction} from "../../model";
import {LineItemBase} from "../../model/Transaction";

export interface CheckoutParams {
    id: string;
    currency: string;
    lineItems?: LineItemBase[];
    sources?: CheckoutSource[];
    simulate?: boolean;
    allowRemainder?: boolean;
    pending?: boolean;
    metadata?: object;
}

export interface CheckoutResponse extends LightrailResponse<Transaction> {
}