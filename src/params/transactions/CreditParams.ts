import {LightrailResponse} from "../LightrailResponse";
import {Transaction, TransactionDestination} from "../../model";

export interface CreditParams {
    id: string;
    destination: TransactionDestination;
    currency: string;
    amount?: number;
    uses?: number;
    simulate?: boolean;
    pending?: boolean;
    metadata?: object;
}

export interface CreditResponse extends LightrailResponse<Transaction> {
}