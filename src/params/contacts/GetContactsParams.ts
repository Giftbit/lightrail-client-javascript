import {Contact} from "../../model";
import {FilterableString} from "../FilterableParam";

export interface GetContactsParams {
    id?: FilterableString;
    tags?: FilterableString;
    firstName?: FilterableString;
    lastName?: FilterableString;
    email?: FilterableString;
}

export interface GetContactsResponse extends Array<Contact> {
}