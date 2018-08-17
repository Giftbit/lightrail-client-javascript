import {LightrailResponse} from "../LightrailResponse";
import {Transaction, TransactionDestination} from "../../model";

export interface CreditParams {
    id: string;
    destination: TransactionDestination;
    amount: number;
    currency: string;
    uses?: number;
    simulate?: boolean;
    pending?: boolean;
    metadata?: object;
}

export interface CreditResponse extends LightrailResponse<Transaction> {
}