import {Contact} from "../../model";
import {LightrailResponse} from "../LightrailResponse";
import {CreateContactParams} from "./CreateContactParams";

export interface UpdateContactParams {
    contactId: string;
    params: Partial<CreateContactParams>;
}

export interface UpdateContactResponse extends LightrailResponse<Contact> {
}
