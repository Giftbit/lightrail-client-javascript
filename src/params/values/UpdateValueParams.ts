import {LightrailResponse} from "../../model/LightrailResponse";
import {Value} from "../../model/Value";

export interface UpdateValueParams extends Partial<Value> {
}

export interface UpdateValueResponse extends LightrailResponse<Value> {
}