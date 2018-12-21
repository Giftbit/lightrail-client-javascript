import {LightrailResponse} from "../LightrailResponse";
import {Transaction} from "../../model";

export interface CapturePendingParams {
    id: string;
}

export interface CapturePendingResponse extends LightrailResponse<Transaction> {
}
