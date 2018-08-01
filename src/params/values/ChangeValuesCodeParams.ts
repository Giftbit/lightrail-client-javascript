import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model/Value";

export interface ChangeValuesCodeParams {
    code: string;
}

export interface ChangeValuesCodeResponse extends LightrailResponse<Value> {
}