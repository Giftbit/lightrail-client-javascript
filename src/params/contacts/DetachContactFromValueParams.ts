import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model";

export interface DetachContactFromValueParams {
    valueId?: string;
}

export interface DetachContactFromValueResponse extends LightrailResponse<Value> {
}