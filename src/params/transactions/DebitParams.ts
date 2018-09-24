import {DebitSource, Transaction} from "../../model";
import {LightrailResponse} from "../LightrailResponse";

export interface DebitParams {
    id: string;
    source: DebitSource;
    amount: number;
    currency: string;
    usesRemaining?: number;
    simulate?: boolean;
    allowRemainder?: boolean;
    pending?: boolean;
    metadata?: object;
}

export interface DebitResponse extends LightrailResponse<Transaction> {
}