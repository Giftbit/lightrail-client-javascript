import {Contact} from "../../model";
import {LightrailResponse} from "../LightrailResponse";

export interface CreateContactParams {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    tags?: string[];
    metadata?: Object;
}

export interface CreateContactResponse extends LightrailResponse<Contact> {
}