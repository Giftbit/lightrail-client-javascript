import {LightrailResponse} from "../LightrailResponse";
import {Transaction} from "../../model";

export interface ReverseParams {
    id: string;
    metadata?: object;
}

export interface ReverseResponse extends LightrailResponse<Transaction> {
}
