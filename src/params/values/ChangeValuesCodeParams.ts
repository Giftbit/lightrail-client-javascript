import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model";

export interface ChangeValuesCodeParams {
    code?: string;
    generateCode?: {
        length: number;
        charset?: string;
        prefix?: string;
        suffix?: string;
    };
    isGenericCode?: boolean;
}

export interface ChangeValuesCodeResponse extends LightrailResponse<Value> {
}
