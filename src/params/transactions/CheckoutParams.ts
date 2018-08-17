import {LightrailResponse} from "../LightrailResponse";
import {CheckoutSource, LineItem, Transaction} from "../../model";

export interface CheckoutParams {
    id: string;
    currency: string;
    lineItems?: LineItem[];
    sources?: CheckoutSource[];
    simulate?: boolean;
    allowRemainder?: boolean;
    pending?: boolean;
    metadata?: object;
}

export interface CheckoutResponse extends LightrailResponse<Transaction> {
}