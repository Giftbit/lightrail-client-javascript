import {LightrailResponse} from "../LightrailResponse";
import {Contact} from "../../model";

export interface GetContactParams {
}

export interface GetContactResponse extends LightrailResponse<Contact> {
}