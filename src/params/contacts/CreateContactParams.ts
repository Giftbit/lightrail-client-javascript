import {Contact} from "../../model";

export interface CreateContactParams {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    tags?: string[];
    metadata?: Object;
}

export interface CreateContactResponse extends Contact {
}