import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model/Value";

export interface GetValueOptions {
    showCode?: boolean;
}

export interface GetValueParams {
    valueId: string;
    options?: GetValueOptions;
}

export interface GetValueResponse extends LightrailResponse<Value> {
}