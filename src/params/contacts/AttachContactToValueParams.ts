import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model";

export interface AttachContactToValueParams {
    valueId?: string;
    code?: string;
}

export interface AttachContactToValueResponse extends LightrailResponse<Value> {
}