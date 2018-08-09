import {LightrailResponse} from "../LightrailResponse";
import {Success} from "../../model/Success";

export interface DeleteValueParams {
    valueId: string;
}

export interface DeleteValueResponse extends LightrailResponse<Success> {
}