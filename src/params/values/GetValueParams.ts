import {LightrailResponse} from "../LightrailResponse";
import {Value} from "../../model/Value";

export interface GetValueParams {
    showCode?: boolean;
}

export interface GetValueResponse extends LightrailResponse<Value> {
}