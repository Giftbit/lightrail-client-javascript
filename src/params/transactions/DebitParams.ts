import {DebitSource, Transaction} from "../../model";
import {LightrailResponse} from "../LightrailResponse";

export interface DebitParams {
    id: string;
    source: DebitSource;
    currency: string;
    amount?: number;
    uses?: number;
    simulate?: boolean;
    allowRemainder?: boolean;
    pending?: boolean;
    metadata?: object;
}

export interface DebitResponse extends LightrailResponse<Transaction> {
}