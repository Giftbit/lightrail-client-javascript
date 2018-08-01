import {Contact} from "../../model";
import {LightrailResponse} from "../LightrailResponse";
import {CreateContactParams} from "./CreateContactParams";

export interface UpdateContactParams extends Partial<CreateContactParams> {
}

export interface UpdateContactResponse extends LightrailResponse<Contact> {
}
