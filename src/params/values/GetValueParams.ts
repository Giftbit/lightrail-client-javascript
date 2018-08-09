import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model/Value";

export interface GetValueParams {
    valueId: string;
    params?: {
        showCode?: boolean
    };
}

export interface GetValueResponse extends LightrailResponse<Value> {
}