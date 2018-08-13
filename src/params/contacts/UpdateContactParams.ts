import {Contact} from "../../model";
import {LightrailResponse} from "../LightrailResponse";
import {CreateContactParams} from "./CreateContactParams";

export interface UpdateContactValues extends Partial<CreateContactParams> {
}

export interface UpdateContactParams {
    contactId: string;
    values: UpdateContactValues;
}

export interface UpdateContactResponse extends LightrailResponse<Contact> {
}
