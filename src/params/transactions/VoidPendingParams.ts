import {LightrailResponse} from "../LightrailResponse";
import {Transaction} from "../../model";

export interface VoidPendingParams {
    id: string;
}

export interface VoidPendingResponse extends LightrailResponse<Transaction> {
}
