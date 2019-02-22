import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model";

export interface DetachContactFromValueParams {
    valueId?: string;
    code?: string;
}

export interface DetachContactFromValueResponse extends LightrailResponse<Value> {
}