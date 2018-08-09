import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model/Value";

export interface ChangeValuesCodeParams {
    valueId: string;
    params?: {
        code: string;
    };
}

export interface ChangeValuesCodeResponse extends LightrailResponse<Value> {
}