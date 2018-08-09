import {Success} from "../../model/Success";
import {LightrailResponse} from "../LightrailResponse";

export interface DeleteContactParams {
    contactId: string;
}

export interface DeleteContactResponse extends LightrailResponse<Success> {
}