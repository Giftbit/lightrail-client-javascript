import {Transaction, TransactionDestination, TransferSource} from "../../model";
import {LightrailResponse} from "../LightrailResponse";

export interface TransferParams {
    id: string;
    source: TransferSource;
    destination: TransactionDestination;
    amount: number;
    currency: string;
    simulate?: boolean;
    allowRemainder?: boolean;
    pending?: boolean;
    metadata?: object;
}

export interface TransferResponse extends LightrailResponse<Transaction> {
}