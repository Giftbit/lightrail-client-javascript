import {LightrailResponse} from "../LightrailResponse";
import {Transaction} from "../../model";

export interface VoidPendingParams {
    id: string;
    metadata?: object;
}

export interface VoidPendingResponse extends LightrailResponse<Transaction> {
}
