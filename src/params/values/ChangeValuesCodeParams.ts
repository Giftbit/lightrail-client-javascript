import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model/Value";

export interface ChangeValuesCodeValues {
    code: string;
}

export interface ChangeValuesCodeParams {
    valueId: string;
    values?: ChangeValuesCodeValues;
}

export interface ChangeValuesCodeResponse extends LightrailResponse<Value> {
}