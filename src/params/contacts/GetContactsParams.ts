import {Contact} from "../../model";

export interface GetContactsParams {
    limit?: number;
    id?: string;
    tags?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface GetContactsResponse extends Array<Contact> {
}