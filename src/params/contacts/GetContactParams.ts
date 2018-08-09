import {LightrailResponse} from "../LightrailResponse";
import {Contact} from "../../model";

export interface GetContactParams {
    contactId: string;
}

export interface GetContactResponse extends LightrailResponse<Contact> {
}